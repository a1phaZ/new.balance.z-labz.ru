const express = require('express');
const router = express.Router();
const MoneyBox = require('../../../models/moneybox');
const toJson = require("../../../handlers/toJson");
const {createError} = require('../../../handlers/error');

const findByUserId = async (userId) => {
	return await MoneyBox.find({userId: userId});
}

router.get('/', (req, res, next) => {
	const {
		query: {vk_user_id}
	} = req;
	findByUserId(vk_user_id)
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

router.get('/:id', async (req, res, next) => {
	const {
		query: {vk_user_id},
		params: {id}
	} = req;
	await MoneyBox.findOne({userId: vk_user_id, _id: id})
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
})

router.post('/', async (req, res, next) => {
	const {
		body: {title, sum},
		query: {vk_user_id}
	} = req;

	const operation = {
		title: `Приход: ${sum}`,
		income: true,
		date: new Date()
	}
	const moneyBox = new MoneyBox({
		userId: vk_user_id,
		title,
		sum: sum || 0,
		operations: !!sum ? [operation] : []
	});

	await moneyBox
		.save()
		.then(async () => await findByUserId(vk_user_id))
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

// router.patch('/:id', (req, res, next) => {
//
// })
//
// router.delete('/:id', (req, res, next) => {
//
// });


module.exports = router;