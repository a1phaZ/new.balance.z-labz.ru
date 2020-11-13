const express = require('express');
const toJson = require("../../../handlers/toJson");
const router = express.Router();
const {createError} = require('../../../handlers/error');
const Budget = require('../../../models/budget');
const Item = require('../../../models/item');
const {getMongooseError} = require("../../../handlers/error");

function getYear(date) {
	return date ? new Date(date).getFullYear() : new Date().getFullYear();
}

function getMonth(date) {
	return date ? new Date(date).getMonth() : new Date().getMonth();
}

router.get('/', async (req, res, next) => {
	const {
		query: {vk_user_id},
		body: {date}
	} = req;

	const year = getYear(date);
	const month = getMonth(date);

	await Budget.find({userId: vk_user_id, year: year, month: month})
		.then((budgetList) => {
			return toJson.dataToJson(budgetList)
		})
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

router.get('/:id', async (req, res, next) => {
	const {
		query: {vk_user_id},
		body: {date},
		params: {id}
	} = req;

	const year = getYear(date);
	const month = getMonth(date);

	await Budget.findOne({_id: id, userId: vk_user_id, year: year, month: month})
		.then(async budget => {
			if (!budget) return Promise.reject(createError(404, 'Бюджет не найден'));
			return await Item.find({userId: vk_user_id, year: year, month: month, tags: budget.title.toLowerCase()})
		})
		.then(itemList => toJson.dataToJson(itemList))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

router.post('/', async (req, res, next) => {
	const {
		query: {vk_user_id},
		body: {title, sum, date}
	} = req;
	const year = getYear(date);
	const month = getMonth(date);
	await Budget.findOne({userId: vk_user_id, title: title, month: month, year: year})
		.then((budget) => {
			if (budget) {
				return Promise.reject(createError(309, `${title} уже добавален, укажите другое название`));
			}
			const newBudget = new Budget({
				userId: vk_user_id,
				title: title,
				month: month,
				year: year,
				sum: sum ? sum : 0,
			})
			return newBudget.save()
		})
		.then(response => toJson.dataToJson(response))
		.then(data => {
			data.message = 'Сохранено'
			res.status(200).json(data)
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
});

router.patch('/:id', async (req, res, next) => {
	const {
		params: {id},
		query: {vk_user_id},
		body: {title, sum}
	} = req;

	await Budget.findOneAndUpdate({_id: id, userId: vk_user_id}, {
		$set: {
			title,
			sum
		}
	}, {new: true})
		.then(response => toJson.dataToJson(response))
		.then(data => {
			data.message = 'Сохранено'
			res.status(200).json(data)
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
})

router.delete('/:id', async (req, res, next) => {
	const {
		params: {id},
		query: {vk_user_id}
	} = req;

	await Budget.deleteOne({_id: id, userId: vk_user_id})
		.then(response => toJson.dataToJson(response))
		.then(data => {
			data.message = 'Удалено'
			res.status(200).json(data)
		})
		.catch(err => next(createError(err.statusCode, err.message)));
});

module.exports = router;