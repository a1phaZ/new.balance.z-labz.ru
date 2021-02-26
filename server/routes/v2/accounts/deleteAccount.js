const Account = require('../../../models/moneybox');
const Item = require('../../../models/item');
const {NOT_FOUND} = require("../../../const/errors");
const {checkIds} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const deleteAccount = async (req, res, next) => {
	const {
		query: {vk_user_id},
		params: {id}
	} = req;
	
	await checkIds(id, vk_user_id, next);
	
	const filter = {userId: vk_user_id, _id: id};
	await Account.findOne(filter)
		.then(account => {
			if (!account) return Promise.reject(createError(404, NOT_FOUND));
			return account;
		})
		.then(account => account.operations)
		.then(operations => Item.deleteMany({_id: {$in: operations}}))
		.then(() => Account.deleteOne({_id: id}))
		.then(() => res.status(200).json({account: null, message: 'Счет удалён'}))
		.catch(err => next(createError(err.statusCode, err.message)));
}

module.exports = deleteAccount;
