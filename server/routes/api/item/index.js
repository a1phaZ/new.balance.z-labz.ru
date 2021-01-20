const express = require('express');
const {format} = require('date-fns');
const Item = require('../../../models/item');
const MoneyBox = require('../../../models/moneybox');
const toJson = require("../../../handlers/toJson");
const {getMongooseError} = require("../../../handlers/error");
const router = express.Router();
const {createError, setErrorStatusCodeAndMessage} = require('../../../handlers/error');
const {isFuture, isValid, isBefore} = require('date-fns');
const mongoose = require('mongoose');
const {getState} = require("../state");
const { Types: {ObjectId}} = mongoose;

const removeItemsFromAccount = async (userId, oldItem) => {
	return await MoneyBox.findOne({userId: userId, operations: oldItem._id})
		.then(box => {
			if (!box) {
				return Promise.reject(createError(404, 'Счет не найден'));
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
			if (!account) {
				return Promise.reject(createError(404, 'Счет не найден'));
			}
			account.operations = [...account.operations, item._id];
			account.$sum = account.sum;
			account.$income = account.income;
			return await account.save();
		})
}

router.get('/', (req, res, next) => {
	const {
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
			itemFrom,
			boxPrice = false
		},
		query: {vk_user_id, tzOffset = 0}
	} = req;

	const d = new Date(date);
	d.setTime( d.getTime() + tzOffset*60*1000 );

	if (title === '' || title === null) {
		return next(createError(400, 'Название не должно быть пустым'));
	}
	if (!parseFloat(price)) {
		return next(createError(400, 'Ошибка преобразования цены'));
	}
	if (!parseFloat(quantity)) {
		return next(createError(400, 'Ошибка преобразования кол-ва'));
	}
	if (isFuture(d)) {
		return next(createError(400,  'Дата в будущем'));
	}
	if (!isValid(new Date(date))) {
		return next(createError(400,  'Дата невалидна'));
	}
	if (isBefore(new Date(date), new Date(2015, 0, 1))) {
		return next(createError(400,  'Ошибка диапазона даты'));
	}
	if (!itemFrom) {
		return next(createError(400, 'Отсутствует идентификатор счета'));
	}

	const item = new Item({
		date: format(date ? new Date(date) : new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price: parseFloat(price),
		quantity: parseFloat(quantity),
		income,
		tags,
		itemFrom,
		boxPrice
	});

	await item.save()
		.then(response => response._id)
		.then(async () => await MoneyBox.findOne({userId: vk_user_id, _id: itemFrom}))
		.then(box => {
			if (!box) {
				return Promise.reject(createError(404, 'Счет не найден'));
			}
			return box;
		})
		.then(async box => {
			box.operations = [...box.operations, item._id];
			box.$sum = item.sum;
			box.$income = item.income;
			return await box.save();
		})
		// .then(async box => await MoneyBox.findById(box._id).populate('operations'))
		.then(() => {
			req.message = 'Запись сохранена';
			next();
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
		body: {
			date,
			title,
			description,
			price,
			quantity,
			income = false,
			tags,
			itemFrom,
			boxPrice = false
		},
		query: {vk_user_id, tzOffset = 0}
	} = req;

	const d = new Date(date);
	d.setTime( d.getTime() + tzOffset*60*1000 );

	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	if (!parseFloat(price)) {
		return next(createError(400, 'Ошибка преобразования цены'));
	}
	if (!parseFloat(quantity)) {
		return next(createError(400, 'Ошибка преобразования кол-ва'));
	}
	if (isFuture(d)) {
		return next(createError(400,  'Дата в будущем'));
	}
	if (!isValid(new Date(date))) {
		return next(createError(400,  'Дата невалидна'));
	}
	if (isBefore(new Date(date), new Date(2015, 0, 1))) {
		return next(createError(400,  'Ошибка диапазона даты'));
	}
	if (!itemFrom) {
		return next(createError(400, 'Отсутствует идентификатор счета'));
	}
	if (title === '' || title === null) {
		return next(createError(400, 'Название не должно быть пустым'));
	}
	if (title.length > 20) {
		return next(createError(400, 'Превышена допустимая длина названия'));
	}
	if (price < 0) {
		return next(createError(400, 'Цена не должна быть меньше 0'));
	}
	if (quantity < 0) {
		return next(createError(400, 'Кол-во не должно быть меньше 0'));
	}


	const oldItem = await Item.findOne({userId: vk_user_id, _id: id}).then(doc => doc);

	await Item.findOneAndUpdate({userId: vk_user_id, _id: id}, {
		$set: {
			date,
			title,
			month: new Date(date).getMonth(),
			year: new Date(date).getFullYear(),
			description,
			price: parseFloat(price),
			quantity: parseFloat(quantity),
			income,
			sum: parseFloat(price) * parseFloat(quantity),
			tags,
			itemFrom,
			boxPrice
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
		.then(() => {
			req.message = 'Запись обновлена';
			next()
		})
		.catch(err => {
			res.json(err);
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

module.exports = router;