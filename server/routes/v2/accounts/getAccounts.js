const Account = require('../../../models/moneybox');
const {isExist} = require("../../../handlers/checkInputData");
const {createError, catchError} = require('../../../handlers/error');
const sortByDate = require('../../../handlers/sortByDate');

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
		.then(accounts => res.status(200).json({accounts: accounts.sort(sortByDate)}))
		.catch((err) => catchError(err, next));
}

module.exports = getAccounts;
