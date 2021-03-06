const express = require('express');
const toJson = require("../../../handlers/toJson");
const router = express.Router();
const {createError} = require('../../../handlers/error');
const Budget = require('../../../models/budget');
const {setErrorStatusCodeAndMessage} = require("../../../handlers/error");
const {getMongooseError} = require("../../../handlers/error");
const mongoose = require('mongoose');
const {getState} = require("../state");
const { Types: {ObjectId}} = mongoose;

function getYear(date) {
	return date ? new Date(date).getFullYear() : new Date().getFullYear();
}

function getMonth(date) {
	return date ? new Date(date).getMonth() : new Date().getMonth();
}

router.post('/', async (req, res, next) => {
	const {
		query: {vk_user_id},
		body: {title, sum}
	} = req;
	const date = new Date();
	const year = getYear(date);
	const month = getMonth(date);
	if (!parseFloat(sum)) {
		return next(createError(400, 'Ошибка преобразования суммы'));
	}
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
				sum: parseFloat(sum) ? parseFloat(sum) : 0,
			})
			return newBudget.save()
		})
		.then(() => {
			req.message = 'Сохранено';
			next()
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(400, getMongooseError(err)))
			}
			if (err.reason) {
				const e = setErrorStatusCodeAndMessage(err);
				next(createError(e.statusCode, e.message));
			}
			return next(createError(err.statusCode, err.message))
		});
}, getState);

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
	if (!parseFloat(sum)) {
		return next(createError(400, 'Ошибка преобразования суммы'));
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
			sum: parseFloat(sum)
		}
	}, {new: true})
		.then(response => {
				if (!response) return Promise.reject(createError(404, 'Запрашиваемый бюджет не найден'));
				return toJson.dataToJson(response)
			}
		)
		.then(() => {
			req.message = 'Сохранено';
			next();
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
}, getState);

router.delete('/:id', async (req, res, next) => {
	const {
		params: {id},
		query: {vk_user_id}
	} = req;

	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	await Budget.deleteOne({_id: id, userId: vk_user_id})
		.then(data => {
			req.message = data.deletedCount !== 0 ? 'Удалено' : 'Нечего удалять';
			req.deletedCount = data.deletedCount;
			next();
		})
		.catch(err => next(createError(err.statusCode, err.message)));
}, getState);

module.exports = router;