const Account = require('../../../models/moneybox');
const {INVALID_ID, NOT_FOUND} = require("../../../const/errors");
const {isValidObjectId, checkAccountData} = require('../../../handlers/checkInputData');
const {createError, catchError} = require('../../../handlers/error');

const updateAccount = async (req, res, next) => {
	const {
		query: {vk_user_id, date = new Date},
		params: {id},
		body: {title}
	} = req;
	
	if (!isValidObjectId(id)) return next(createError(400,  INVALID_ID));
	
	checkAccountData({title, vk_user_id, date}, {sumCheck: false, dateCheck: true}, next);
	
	const currentMonth = new Date(date).getMonth();
	const currentYear = new Date(date).getFullYear();
	const filter = {userId: vk_user_id, _id: id};
	await Account.findOne(filter)
		.then(account => {
			if (!account) return next(createError(404, NOT_FOUND));
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
		.catch(err => catchError(err, next));
}

module.exports = updateAccount