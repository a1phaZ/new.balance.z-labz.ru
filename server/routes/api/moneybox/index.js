const express = require('express');
const router = express.Router();
const {format} = require('date-fns');
const MoneyBox = require('../../../models/moneybox');
const Item = require('../../../models/item');
const toJson = require("../../../handlers/toJson");
const {createError} = require('../../../handlers/error');

const findByUserId = async (userId) => {
	return await MoneyBox.find({userId: userId})
		.populate('operations');
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
		body: {title, sum, income = true},
		query: {vk_user_id}
	} = req;

	const item = sum && await new Item({
		date: format(new Date(), 'yyyy.MM.dd'),
		userId: vk_user_id,
		title,
		price: sum,
		quantity: 1,
		sum: sum,
		income,
	}).save();

	const moneyBox = new MoneyBox({
		userId: vk_user_id,
		title,
		sum: 0,
		operations: !!sum ? [item._id] : []
	});

	moneyBox.$sum= sum || 0;
	moneyBox.$income = income;

	await moneyBox
		.save()
		// .then(async () => await findByUserId(vk_user_id))
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