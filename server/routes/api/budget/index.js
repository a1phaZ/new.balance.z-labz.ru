const express = require('express');
const {format} = require('date-fns');
const toJson = require("../../../handlers/toJson");
const router = express.Router();
const {createError} = require('../../../handlers/error');
const Item = require('../../../models/item');
const Budget = require('../../../models/budget');

router.get('/', (req, res, next) => {

});

router.post('/', async (req, res, next) => {
	const {
		query: { vk_user_id },
		body: { title, sum, date }
	} = req;
	const year = date ? new Date(date).getFullYear() : new Date().getFullYear();
	const month = date ? new Date(date).getMonth() : new Date().getMonth();
	Budget.findOne({userId: vk_user_id, title: title})
		.then((budget) => {
			if (!budget) {
				const budgetItem = budget.monthlyBudget.find(item => (item.month === month && item.year === year));
				if (budgetItem) {
					return Promise.reject(createError(309, `${title} уже добавален, выберите другое название`));
				}
			}
		})
});

router.delete('/:id', (req, res, next) => {

});

module.exports = router;