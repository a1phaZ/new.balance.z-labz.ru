const mongoose = require('mongoose');
const { Types: {ObjectId}} = mongoose;
const {isValid, isFuture} = require('date-fns');
const maxTitleLength = process.env.MAX_TITLE_LENGTH || 20;
const {createError} = require('../handlers/error');
const {INVALID_ID, NOT_EXIST, INVALID_FLOAT, INVALID_DATE, INVALID_DATE_RANGE, NEGATIVE_VALUE, INVALID_LENGTH} = require("../const/errors");

const isExist = (p) => {
	return !!p;
}

const isValidObjectId = (id) => {
	return ObjectId.isValid(id) && (new ObjectId(id)).toString() === id
}

const isValidDate = (date) => {
	return isValid(new Date(date));
}

const isValidFloat = (number) => {
	return !!parseFloat(number)
}

const isPositive = (number) => {
	return number > 0
}

const isValidLength = (str) => {
	return str.length <= maxTitleLength;
}

const isFutureDate = (date = new Date()) => {
	return isFuture(new Date(date));
}

const checkItemData = (data, next) => {
	const {
		date,
		title,
		description = '',
		price,
		quantity,
		itemFrom,
		vk_user_id,
		params: {
			tzOffset
		}
	} = data;
	
	const d = new Date(date);
	d.setTime( d.getTime() + tzOffset*60*1000 );
	
	if (!isValidObjectId(itemFrom)) return next(createError(400, INVALID_ID));
	if (!isExist(itemFrom)) return next(createError(400, NOT_EXIST));
	if (!isExist(title)) return next(createError(400, NOT_EXIST));
	if (!isValidLength(title)) return next(createError(400, INVALID_LENGTH));
	if (!isValidFloat(price)) return next(createError(400, INVALID_FLOAT));
	if (!isValidFloat(quantity)) return next(createError(400, INVALID_FLOAT));
	if (isFutureDate(d)) return next(createError(400,  INVALID_DATE_RANGE));
	if (!isValidDate(new Date(date))) return next(createError(400,  INVALID_DATE));
	if (!isExist(vk_user_id)) return next(createError(400, NOT_EXIST));
	if (!isPositive(price)) return next(createError(400, NEGATIVE_VALUE));
	if (!isPositive(quantity)) return next(createError(400, NEGATIVE_VALUE));
	if (description && description.length > 70) return next(createError(400, INVALID_LENGTH));
	
	return true;
}

const checkBudgetData = (data, next) => {
	const {
		title,
		sum,
		vk_user_id
	} = data;
	
	if (!isExist(title)) return next(createError(400, 'Название не должно быть пустым'));
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isValidLength(title)) return next(createError(400, 'Превышена допустимая длина названия'));
	if (!isExist(sum)) return next(createError(400, 'Сумма не должна быть пустой'));
	if (!isValidFloat(sum)) return next(createError(400, 'Ошибка преобразования суммы'));
	if (!isPositive(sum)) return next(createError(400, 'Сумма должна быть больше 0'));
	
	return true;
}

const checkAccountData = (data, opt, next) => {
	const {
		title,
		sum,
		vk_user_id,
		date
	} = data;
	const {
		sumCheck = true,
		dateCheck = false
	} = opt;
	
	if (!isExist(title)) return next(createError(400, 'Название не должно быть пустым'));
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (sumCheck) {
		if (!isExist(sum)) return next(createError(400, 'Сумма не должна быть пустой'));
		if (!isValidFloat(sum)) return next(createError(400, 'Ошибка преобразования суммы'));
		if (!isPositive(sum)) return next(createError(400, 'Сумма не должна быть меньше 0'));
	}
	if (dateCheck) {
		if (!isValidDate(date)) return next(createError(400,  'Ошибка даты'));
	}
	if (!isValidLength(title)) return next(createError(400, 'Превышена допустимая длина названия'));
	
	return true;
}

const checkIds = (id, userId, next) => {
	if (!isExist(userId)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isValidObjectId(id)) return next(createError(400,  'Ошибка идентификатора объекта'));
	
	return true;
}

module.exports = {
	isExist,
	isValidObjectId,
	isValidDate,
	isValidFloat,
	isPositive,
	isValidLength,
	isFutureDate,
	checkItemData,
	checkBudgetData,
	checkAccountData,
	checkIds
}