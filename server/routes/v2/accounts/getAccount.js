const Account = require('../../../models/moneybox');
const {isExist, isValidObjectId, isValidDate} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const getAccount = async (req, res, next) => {
	const {
		query: {
			vk_user_id,
			date = new Date()
		},
		params: {
			id
		}
	}	= req;
	
	if (!isExist(vk_user_id)) return next(createError(400,  'Отсутствует идентификатор пользователя'));
	if (!isValidObjectId(id)) return next(createError(400,  'Ошибка идентификатора объекта'));
	if (!isValidDate(date)) return next(createError(400,  'Ошибка даты'));
	
	const filter = {userId: vk_user_id, _id: id};
	const currentMonth = new Date(date).getMonth();
	const currentYear = new Date(date).getFullYear();
	await Account.findOne(filter)
		.select('-__v')
		.populate({
			path: 'operations',
			match: {year: {$eq: currentYear}, month: {$eq: currentMonth}},
			select: '-__v',
		})
		.then(account => {
			if (!account) return next(createError(404, 'Счет не найден'));
			return res.status(200).json({account: account})
		})
		.catch(() => next(createError(400,  'Ошибка чтения из БД')));
}

module.exports = getAccount;
