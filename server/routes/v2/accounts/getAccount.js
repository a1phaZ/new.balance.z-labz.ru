const Account = require('../../../models/moneybox');
const {INVALID_DATE, NOT_FOUND} = require("../../../const/errors");
const {isValidDate, checkIds} = require("../../../handlers/checkInputData");
const {createError, catchError} = require('../../../handlers/error');

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
	
	await checkIds(id, vk_user_id, next);
	if (!isValidDate(date)) return next(createError(400,  INVALID_DATE));
	
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
			if (!account) return next(createError(404, NOT_FOUND));
			return res.status(200).json({account: account})
		})
		.catch((err) => catchError(err, next));
}

module.exports = getAccount;
