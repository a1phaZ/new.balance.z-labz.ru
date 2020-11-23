const express = require('express');
const router = express.Router();
const MoneyBox = require('../../../models/moneybox');
const Budget = require('../../../models/budget');
const Item = require('../../../models/item');
const toJson = require("../../../handlers/toJson");
const {createError} = require('../../../handlers/error');
const {isValid, isBefore} = require('date-fns');

const findAccountsByUserId = async (userId, date = new Date()) => {
	return MoneyBox.find({userId: userId})
		.populate({
			path: 'operations',
			match: {
				year: new Date(date).getFullYear(),
				month: new Date(date).getMonth()
			}
		});
}

const findBudgets = async (userId, date = new Date()) => {
	return await Budget.find({userId: userId, year: new Date(date).getFullYear(), month: new Date(date).getMonth()})
}

const findItems = async (userId, title, year, month) => {
	return await Item.find({userId: userId, tags: title.toLowerCase(), year: year, month: month});
}

async function budgetWithOutcomeF(array) {
	let budgetWithOutcome = [];

	for (const item of array) {
		const changedItem = {
			_id: item._id,
			userId: item.userId,
			title: item.title,
			startSum: item.sum,
			sum: item.sum,
			month: item.month,
			year: item.year
		};
		await findItems(changedItem.userId, changedItem.title, changedItem.year, changedItem.month)
			.then(data => {
				return data.map(el => el.income ? -1*el.sum : el.sum).reduce((acc, cur) => acc + cur, 0);
			})
			.then(sum => {
				changedItem.sum = changedItem.sum - sum;
				return changedItem;
			})
			.then(item => {
				budgetWithOutcome = [...budgetWithOutcome, item];
			});
	}

	return budgetWithOutcome;
}

async function budgetWithDetails(array) {
	let budgetWithDetails = [];

	for (const item of array) {
		const changedItem = {
			_id: item._id,
			userId: item.userId,
			title: item.title,
			startSum: item.startSum,
			sum: item.sum,
			month: item.month,
			year: item.year,
			items: []
		};
		await findItems(changedItem.userId, changedItem.title, changedItem.year, changedItem.month)
			.then(data => {
				const changedData = data.map((item) => {
					item.date = item.date.replace(/[.]/g, '-');
					return item;
				})
				changedItem.items = [...changedData];
				return changedItem;
			})
			.then(item => budgetWithDetails = [...budgetWithDetails, item]);
	}

	// console.log(budgetWithDetails);
	return budgetWithDetails;
}

router.get('/', async (req, res, next) => {
	const {
		query: { vk_user_id, date }
	} = req;

	// if (isFuture(new Date(date))) {
	// 	return next(createError(400,  'Дата в будущем'));
	// }
	if (!isValid(new Date(date))) {
		return next(createError(400,  'Дата невалидна'));
	}
	if (isBefore(new Date(date), new Date(2015, 0, 1))) {
		return next(createError(400,  'Ошибка диапазона даты'));
	}

	req.accounts = await findAccountsByUserId(vk_user_id, date).then(data => {
		data.map(item => {
			const {operations} = item;
			const editedItems = operations.map(item => {
				item.date = item.date.replace(/[.]/g, '-');
				return item;
			})
			item.operations = [...editedItems];
		})

		// console.log(data);
		return data;
	});
	req.budgets = await findBudgets(vk_user_id, date).then(data => data);
	req.budgets = await budgetWithOutcomeF(req.budgets);
	req.budgets = await budgetWithDetails(req.budgets);
	await res.status(200).json(await toJson.dataToJson( {accounts: req.accounts, budgets: req.budgets}));
	// await next();
});

module.exports = router;