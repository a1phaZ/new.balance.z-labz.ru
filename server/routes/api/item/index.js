const express = require('express');
const {format} = require('date-fns');
const Item = require('../../../models/item');
const MoneyBox = require('../../../models/moneybox');
const toJson = require("../../../handlers/toJson");
const {getMongooseError} = require("../../../handlers/error");
const router = express.Router();
const {createError} = require('../../../handlers/error');

const removeItemsFromAccount = async (userId, oldItem) => {
	return await MoneyBox.findOne({userId: userId, operations: oldItem._id})
		.then(box => {
			if (!box) {
				return Promise.reject(createError(404, 'Not Found'));
			}
			return box;
		})
		.then(async account => {
			const index = account.operations.findIndex((item) => {
				return item.toString() === oldItem._id.toString()
			});
			account.operations = [...account.operations.slice(0, index), ...account.operations.slice(index+1, account.operations.length)];
			account.$sum = -1*(oldItem.sum);
			account.$income = oldItem.income;
			return await account.save();
		})
}

const addItemsToAccount = async (userId, item) => {
	return await MoneyBox.findOne({userId: userId, _id: item.itemFrom})
		.then(async account => {
			account.operations = [...account.operations, item._id];
			account.$sum = account.sum;
			account.$income = account.income;
			return await account.save();
		})
}

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
		date: format(date ? new Date(date) : new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price,
		quantity,
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
		.then(data => {
			data.message = 'Запись сохранена'
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

	const oldItem = await Item.findOne({userId: vk_user_id, _id: id}).then(doc => doc);

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
		.then(async (doc) => {
			if (oldItem.itemForm !== doc.itemFrom) {
				await removeItemsFromAccount(vk_user_id, oldItem);
				await addItemsToAccount(vk_user_id, doc);
			}
		})
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
		.then(data => {
			data.message = 'Запись обновлена'
			res.status(200).json(data)
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
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