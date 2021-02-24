const Account = require('../../../models/moneybox');
const Item = require('../../../models/item');
const {isValidObjectId} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const deleteAccount = async (req, res, next) => {
	const {
		query: {vk_user_id},
		params: {id}
	} = req;
	
	if (!isValidObjectId(id)) {
		return next(createError(400,  'Ошибка идентификатора объекта'));
	}
	const filter = {userId: vk_user_id, _id: id};
	await Account.findOne(filter)
		.then(account => {
			if (!account) return Promise.reject(createError(404, 'Счет не найден'));
			return account;
		})
		.then(account => account.operations)
		.then(operations => Item.deleteMany({_id: {$in: operations}}))
		.then(() => Account.deleteOne({_id: id}))
		.then(() => res.status(200).json({account: null, message: 'Счет удалён'}))
		.catch(err => next(createError(err.statusCode, err.message)));
}

module.exports = deleteAccount;
