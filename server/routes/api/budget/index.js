const express = require('express');
const toJson = require("../../../handlers/toJson");
const router = express.Router();
const {createError} = require('../../../handlers/error');
const Budget = require('../../../models/budget');
// const Item = require('../../../models/item');
const {setErrorStatusCodeAndMessage} = require("../../../handlers/error");
const {getMongooseError} = require("../../../handlers/error");
const mongoose = require('mongoose');
const { Types: {ObjectId}} = mongoose;

function getYear(date) {
	return date ? new Date(date).getFullYear() : new Date().getFullYear();
}

function getMonth(date) {
	return date ? new Date(date).getMonth() : new Date().getMonth();
}

// router.get('/', async (req, res, next) => {
// 	const {
// 		query: {vk_user_id},
// 		body: {date}
// 	} = req;
//
// 	const year = getYear(date);
// 	const month = getMonth(date);
//
// 	await Budget.find({userId: vk_user_id, year: year, month: month})
// 		.then((budgetList) => {
// 			return toJson.dataToJson(budgetList)
// 		})
// 		.then(data => res.status(200).json(data))
// 		.catch(err => {
// 			const e = err.reason ? setErrorStatusCodeAndMessage(err) : err;
// 			next(createError(e.statusCode, e.message));
// 		});
// });
//
// router.get('/:id', async (req, res, next) => {
// 	const {
// 		query: {vk_user_id},
// 		body: {date},
// 		params: {id}
// 	} = req;
//
// 	const year = getYear(date);
// 	const month = getMonth(date);
//
// 	await Budget.findOne({_id: id, userId: vk_user_id, year: year, month: month})
// 		.then(async budget => {
// 			if (!budget) return Promise.reject(createError(404, 'Бюджет не найден'));
// 			return await Item.find({userId: vk_user_id, year: year, month: month, tags: budget.title.toLowerCase()})
// 		})
// 		.then(itemList => toJson.dataToJson(itemList))
// 		.then(data => res.status(200).json(data))
// 		.catch(err => {
// 			const e = err.reason ? setErrorStatusCodeAndMessage(err) : err;
// 			next(createError(e.statusCode, e.message));
// 		});
// });

router.post('/', async (req, res, next) => {
	const {
		query: {vk_user_id},
		body: {title, sum}
	} = req;
	const date = new Date();
	const year = getYear(date);
	const month = getMonth(date);
	await Budget.findOne({userId: vk_user_id, title: title, month: month, year: year})
		.then((budget) => {
			if (budget) {
				return Promise.reject(createError(400, `${title} уже добавален, укажите другое название`));
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
			// res.json(err);
			if (err.errors) {
				return next(createError(400, getMongooseError(err)))
			}
			if (err.reason) {
				const e = setErrorStatusCodeAndMessage(err);
				next(createError(e.statusCode, e.message));
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

	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	if (title === '' || title === null) {
		return next(createError(400, 'Название не должно быть пустым'))
	}
	if (!sum) {
		return next(createError(400, 'Сумма не должна быть пустой'));
	}
	if (sum < 0) {
		return next(createError(400, 'Сумма не должна быть меньше 0'));
	}
	if (title.length > 20) {
		return next(createError(400, 'Превышена допустимая длина названия'));
	}

	await Budget.findOneAndUpdate({_id: id, userId: vk_user_id}, {
		$set: {
			title,
			sum
		}
	}, {new: true})
		.then(response => {
				if (!response) return Promise.reject(createError(404, 'Запрашиваемый бюджет не найден'));
				return toJson.dataToJson(response)
			}
		)
		.then(data => {
			data.message = 'Сохранено'
			res.status(200).json(data)
		})
		.catch(err => {
			// res.json(err);
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

	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	await Budget.deleteOne({_id: id, userId: vk_user_id})
		.then(response => {
			return toJson.dataToJson(response)
		})
		.then(data => {
			data.message = data.data.deletedCount !== 0 ? 'Удалено' : 'Нечего удалять'
			res.status(data.data.deletedCount !== 0 ? 200 : 404).json(data)
		})
		.catch(err => next(createError(err.statusCode, err.message)));
});

module.exports = router;