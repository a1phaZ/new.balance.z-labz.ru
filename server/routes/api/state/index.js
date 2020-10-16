const express = require('express');
const router = express.Router();
const MoneyBox = require('../../../models/moneybox');
const Budget = require('../../../models/budget');
const Item = require('../../../models/item');
const toJson = require("../../../handlers/toJson");

const findAccountsByUserId = async (userId) => {
	return await MoneyBox.find({userId: userId})
		.populate('operations');
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
				return data.map(el => el.sum).reduce((acc, cur) => acc + cur, 0);
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

router.get('/', async (req, res) => {
	const {
		query: { vk_user_id },
		body: { date }
	} = req;

	req.accounts = await findAccountsByUserId(vk_user_id).then(data => data);
	req.budgets = await findBudgets(vk_user_id, date).then(data => data);
	req.budgets = await budgetWithOutcomeF(req.budgets);
	await res.status(200).json(await toJson.dataToJson( {accounts: req.accounts, budgets: req.budgets}));
	// await next();
});

module.exports = router;