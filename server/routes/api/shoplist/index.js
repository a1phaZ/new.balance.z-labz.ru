const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Types: {ObjectId}} = mongoose;

const {createError, getMongooseError, setErrorStatusCodeAndMessage} = require('../../../handlers/error');
const ShopList = require('../../../models/shoplist');
const toJson = require("../../../handlers/toJson");

router.get('/:id', async (req, res, next) => {
	const {
		params: {
			id
		}
	} = req;
	
	if (!(ObjectId.isValid(id) && (new ObjectId(id)).toString() === id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	
	await ShopList.findById(id)
		.then(({list}) => {
			return toJson.dataToJson({list})
		})
		.then(data => res.status(200).json(data))
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
});

router.post('/add', async (req, res, next) => {
	const {
		body: {
			list
		}
	} = req;
	
	if (!list) {
		return next(createError(400, 'Отсутствуют обязательные параметры'));
	}
	
	if (list.length === 0) {
		return next(createError(400, 'Список не должен быть пустым'));
	}
	
	const titleOnly = list.reduce((acc, {done, title}) => {
		if (!done && title) {
			return [...acc, {title}];
		}
		return acc;
	}, []);
	
	if (titleOnly.length === 0) {
		return next(createError(400, 'Не найдено ни одного названия в списке'));
	}
	
	const listToSave = new ShopList({
		list: titleOnly
	});
	
	await listToSave.save()
		.then(({_id}) => {
			return toJson.dataToJson({id: _id})
		})
		.then(data => res.status(200).json(data))
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
});

module.exports = router;
