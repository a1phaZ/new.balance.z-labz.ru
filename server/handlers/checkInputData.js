const mongoose = require('mongoose');
const { Types: {ObjectId}} = mongoose;
const {isValid, isFuture} = require('date-fns');
const maxTitleLength = process.env.MAX_TITLE_LENGTH || 20;

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

module.exports = {
	isExist,
	isValidObjectId,
	isValidDate,
	isValidFloat,
	isPositive,
	isValidLength,
	isFutureDate
}