const Account = require('../../../models/moneybox');
const {isExist} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const getAccounts = async (req, res, next) => {
	const {
		query: {
			vk_user_id
		}
	} = req;
	
	if (!isExist(vk_user_id)) return next(createError(400,  'Отсутствует идентификатор пользователя'));
	
	const filter = {userId: vk_user_id}
	await Account.find(filter)
		.select('-__v -operations')
		.then(accounts => res.status(200).json({accounts: accounts}))
		.catch(() => next(createError(400,  'Ошибка чтения из БД')));
}

module.exports = getAccounts;
