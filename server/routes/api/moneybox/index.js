const express = require('express');

const router = express.Router();
const {format, isFuture, isValid, isBefore} = require('date-fns');
const MoneyBox = require('../../../models/moneybox');
const Item = require('../../../models/item');
const toJson = require("../../../handlers/toJson");
const {createError, getMongooseError} = require('../../../handlers/error');
const mongoose = require('mongoose');
const {getState} = require("../state");
const { Types: {ObjectId}} = mongoose;
const {itemSaveAndUpdateAccount} = require("../../../handlers/itemSaveAndUpdateAccount");

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
	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	await MoneyBox.findOne({userId: vk_user_id, _id: id})
		.populate('operations')
		.then(response => toJson.dataToJson(response))
		.then(data => res.status(200).json(data))
		.catch(err => next(createError(err.statusCode, err.message)));
})

router.post('/', async (req, res, next) => {
	const {
		body: {title, sum, income = true},
		query: {vk_user_id}
	} = req;

	if (title === '' || title === null) {
		return next(createError(400, 'Название не должно быть пустым'));
	}
	if (!sum) {
		return next(createError(400, 'Сумма не должна быть пустой'));
	}
	if (!parseFloat(sum)) {
		return next(createError(400, 'Ошибка преобразования суммы'));
	}
	if (sum < 0) {
		return next(createError(400, 'Сумма не должна быть меньше 0'));
	}
	if (title.length > 20) {
		return next(createError(400, 'Превышена допустимая длина названия'));
	}

	const item = sum && await new Item({
		date: format(new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title: `Остаток`,
		price: parseFloat(sum),
		quantity: 1,
		sum: parseFloat(sum),
		income,
	}).save();

	const moneyBox = new MoneyBox({
		userId: vk_user_id,
		title,
		sum: 0,
		operations: !!sum ? [item._id] : []
	});

	moneyBox.$sum = sum || 0;
	moneyBox.$income = income;

	await moneyBox
		.save()
		.then(async response => await MoneyBox.findById({_id: response._id}).populate('operations'))
		.then(box => {
			if (!box) return Promise.reject(createError(404, 'Счет не найден'));
			return box;
		})
		.then(() => {
			req.message = 'Сохранено'
			next();
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
}, getState);

router.post('/transfer', async (req, res, next) => {
	const {
		body: {
			date,
			title,
			description = '',
			price,
			tags = [],
			from,
			to,
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
	if (isFuture(d)) {
		return next(createError(400,  'Дата в будущем'));
	}
	if (!isValid(new Date(date))) {
		return next(createError(400,  'Дата невалидна'));
	}
	if (isBefore(new Date(date), new Date(2015, 0, 1))) {
		return next(createError(400,  'Ошибка диапазона даты'));
	}
	if (!from || !to) {
		return next(createError(400, 'Отсутствует идентификатор счета'));
	}
	if (!(ObjectId.isValid(to) && (new ObjectId(to)).toString() === to)) {
		return next(createError(400,  'Ошибка идентификатора счета'));
	}
	if (!(ObjectId.isValid(from) && (new ObjectId(from)).toString() === from)) {
		return next(createError(400,  'Ошибка идентификатора счета'));
	}

	const itemTo = new Item({
		date: format(date ? new Date(date) : new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price: parseFloat(price),
		quantity: 1,
		income: true,
		tags,
		itemFrom: to,
		boxPrice
	});
	const itemFrom = new Item({
		date: format(date ? new Date(date) : new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price: parseFloat(price),
		quantity: 1,
		income: false,
		tags,
		itemFrom: from,
		boxPrice
	});

	const accountTo = await itemSaveAndUpdateAccount(itemTo, vk_user_id, to);
	const accountFrom = await itemSaveAndUpdateAccount(itemFrom, vk_user_id, from);

	if (accountFrom.statusCode) {
		return next(accountFrom);
	}
	if (accountTo.statusCode) {
		return next(accountTo);
	}

	req.message = 'Перевод совершен';
	next();

}, getState);

router.patch('/:id', async (req, res, next) => {
	const {
		query: {vk_user_id},
		params: {id},
		body: {title = ''}
	} = req;

	if (title === '' || title === null) {
		return next(createError(400, 'Название не должно быть пустым'));
	}
	if (title.length > 20) {
		return next(createError(400, 'Превышена допустимая длина названия'));
	}
	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	await MoneyBox.findOneAndUpdate({userId: vk_user_id, _id: id}, {$set: {title: title}}, {new: true})
		.then(box => {
			if (!box) return Promise.reject(createError(404, 'Счет не найден'));
			return box;
		})
		.then(() => {
			req.message = 'Сохранено'
			next();
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
}, getState);

router.delete('/:id', async (req, res, next) => {
	const {
		query: {vk_user_id},
		params: {id}
	} = req;

	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	await MoneyBox.findOne({userId: vk_user_id, _id: id})
		.then(box => {
			if (!box) return Promise.reject(createError(404, 'Счет не найден'));
			return box;
		})
		.then(box => box.operations)
		.then(operations => Item.deleteMany({_id: {$in: operations}}))
		.then(() => MoneyBox.deleteOne({_id: id}))
		.then(data => {
			req.message = data.deletedCount !== 0 ? 'Удалено' : 'Нечего удалять'
			next()
		})
		.catch(err => next(createError(err.statusCode, err.message)));
}, getState);

module.exports = router;
