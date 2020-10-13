const express = require('express');
const toJson = require("../../../handlers/toJson");
const router = express.Router();
const {createError} = require('../../../handlers/error');
//const Item = require('../../../models/item');
const Budget = require('../../../models/budget');

function getYear(date) {
	return date ? new Date(date).getFullYear() : new Date().getFullYear();
}

function getMonth(date) {
	return date ? new Date(date).getMonth() : new Date().getMonth();
}

router.get('/', (req, res, next) => {
	const {
		query: { vk_user_id },
		body: { date }
	} = req;

	const year = getYear(date);
	const month = getMonth(date);

	Budget.find({userId: vk_user_id, year: year, month: month})
		.then((budgetList) => {
			return toJson.dataToJson(budgetList)
		})
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

router.post('/', async (req, res, next) => {
	const {
		query: { vk_user_id },
		body: { title, sum, date }
	} = req;
	const year = getYear(date);
	const month = getMonth(date);
	Budget.findOne({userId: vk_user_id, title: title, month: month, year: year})
		.then((budget) => {
			if (budget) {
				return Promise.reject(createError(309, `${title} уже добавален, укажите другое название или дату`));
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
		.catch(err => next(createError(err.statusCode, err.message)));
});

// router.delete('/:id', (req, res, next) => {
//
// });

module.exports = router;