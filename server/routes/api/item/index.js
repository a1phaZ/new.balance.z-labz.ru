const express = require('express');
const {format} = require('date-fns');
const Item = require('../../../models/item');
const MoneyBox = require('../../../models/moneybox');
const toJson = require("../../../handlers/toJson");
const router = express.Router();
const {createError} = require('../../../handlers/error');

router.get('/', (req, res, next) => {
	const {
		// body: {
		// 	beginDate,
		// 	endDate
		// },
		query: {vk_user_id}
	} = req;
	Item.find({userId: vk_user_id})
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

router.post('/', async (req, res, next) => {
	const {
		body: {
			date,
			title,
			description,
			price,
			quantity,
			income = false,
			tags,
			itemFrom
		},
		query: {vk_user_id}
	} = req;

	const item = new Item({
		date: format(new Date(date), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price,
		quantity,
		sum: price * quantity,
		income,
		tags,
		itemFrom
	});

	await item.save()
		.then(response => response._id)
		.then(async () => await MoneyBox.findOne({userId: vk_user_id, _id: itemFrom}))
		.then(box => {
			if (!box) {
				return Promise.reject(createError(404, 'Not Found'));
			}
			return box;
		})
		.then(async box => {
			box.operations = [...box.operations, item._id];
			box.$sum = item.sum;
			box.$income = item.income;
			return await box.save();
		})
		.then(async box => await MoneyBox.findById(box._id).populate('operations'))
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

router.patch('/:id', async (req, res, next) => {
	const {
		params: {id},
		body: {
			date,
			title,
			description,
			price,
			quantity,
			income = false,
			tags,
			itemFrom
		},
		query: {vk_user_id}
	} = req;

	await Item.findOneAndUpdate({userId: vk_user_id, _id: id}, {
		$set: {
			date,
			title,
			description,
			price,
			quantity,
			income,
			sum: price * quantity,
			tags,
			itemFrom
		}
	}, {new: true})
		.then(async () => await MoneyBox.findOne({userId: vk_user_id, _id: itemFrom}).populate('operations'))
		.then(box => {
			const operation = [...box.operations];
			return operation.map(el => el.income ? el.sum : (-1)*el.sum).reduce((acc, cur) => acc + cur, 0);
		})
		.then(async (sum) => {
			return MoneyBox.findOneAndUpdate({
				userId: vk_user_id,
				_id: itemFrom
			}, {$set: {sum: sum}}, {new: true}).populate('operations');
		})
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

// {
// 	title: {type: String, required: true},
// 	description: {type: String, default: ''},
// 	price: {type: Number, required: true},
// 	quantity: {type: Number, required: true},
// 	sum: {type: Number, required: true},
// 	income: {type: Number, default: false},
// 	tags: {type: Array, default: []},
// 	itemFrom: {type: Schema.Types.ObjectId, ref: 'MoneyBox'}
// }

module.exports = router;