const Account = require('../../../models/moneybox');
const {isExist, isValidObjectId, isValidLength, isValidDate} = require('../../../handlers/checkInputData');
const {createError, getMongooseError} = require('../../../handlers/error');

const updateAccount = async (req, res, next) => {
	const {
		query: {vk_user_id, date = new Date},
		params: {id},
		body: {title}
	} = req;
	
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isExist(title)) return next(createError(400, 'Название не должно быть пустым'));
	if (!isValidLength(title)) return next(createError(400, 'Превышена допустимая длина названия'));
	if (!isValidObjectId(id)) return next(createError(400,  'Ошибка идентификатора объекта'));
	if (!isValidDate(date)) return next(createError(400,  'Ошибка даты'));
	
	const currentMonth = new Date(date).getMonth();
	const currentYear = new Date(date).getFullYear();
	const filter = {userId: vk_user_id, _id: id};
	await Account.findOne(filter)
		.then(account => {
			if (!account) return next(createError(404, 'Счет не найден'));
		});
	await Account.findOneAndUpdate(filter, {$set: {title: title}}, {new: true})
		.select('-__v')
		.populate({
			path: 'operations',
			match: {year: {$eq: currentYear}, month: {$eq: currentMonth}},
			select: '-__v',
		})
		.then(account => {
			res.status(200).json({account: account})
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
}

module.exports = updateAccount