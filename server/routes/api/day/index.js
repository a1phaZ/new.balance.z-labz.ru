const express = require('express');
const {format} = require('date-fns');
const Day = require('../../../models/day');
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
	Day.find({userId: vk_user_id})
		.populate('items.itemFrom')
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

	await MoneyBox.findOne({userId: vk_user_id, _id: itemFrom})
		.then(box => {
			if (!box) {
				return Promise.reject(createError(404, 'Not Found'));
			}
			return box;
		})
		.then(async box => {
			box.operations = [...box.operations, {title, income, date, sum: price * quantity}];
			return await box.save();
		})
		.then(async () => await Day.findOne({userId: vk_user_id, date: format(new Date(date), 'yyyy.MM.dd')}))
		.then(async day => {
			if (!day) {
				const day = new Day({
					userId: Number(vk_user_id),
					date: format(new Date(date), 'yyyy.MM.dd'),
					items: [{
						title,
						description,
						price,
						sum: price * quantity,
						quantity,
						income,
						tags,
						itemFrom
					}]
				});
				return await day.save();
			} else {
				day.items = [...day.items, {
					title,
					description,
					price,
					sum: price * quantity,
					quantity,
					income,
					tags,
					itemFrom
				}];
				return await day.save();
			}
		})
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
});

// {
// 	userId: {type: Number, required: true},
// 	dateTime: {type: Date, default: new Date()},
// 	totalSum: {type: Number},
// 	items: [
// 		{
// 			title: {type: String, required: true},
// 			description: {type: String, default: ''},
// 			price: {type: Number, required: true},
// 			quantity: {type: Number, required: true},
// 			sum: {type: Number, required: true},
// 			income: {type: Number, default: false},
// 			tags: {type: Array, default: []},
// 			itemFrom: {type: Schema.Types.ObjectId, ref: 'MoneyBox'}
// 		}
// 	]
// }

module.exports = router;