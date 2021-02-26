const Account = require('../../../models/moneybox');
const Item = require('../../../models/item');
const {NOT_FOUND} = require("../../../const/errors");
const {checkAccountData} = require('../../../handlers/checkInputData');
const {format} = require('date-fns');
const {createError, getMongooseError} = require('../../../handlers/error');

const addAccount = async (req, res, next) => {
	const {
		body: {title, sum, income = true},
		query: {vk_user_id}
	} = req;

	await checkAccountData({title, sum, vk_user_id}, {sumCheck: true, dateCheck: false}, next);

	const item = new Item({
		date: format(new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title: `Остаток`,
		price: parseFloat(sum),
		quantity: 1,
		sum: parseFloat(sum),
		income,
	})
		await item.save();

	const account = new Account({
		userId: vk_user_id,
		title,
		sum: 0,
		operations: !!sum ? [item._id] : []
	});
	
	account.$sum = sum || 0;
	account.$income = income;

	await account.save()
		.then(async response => await Account.findById({_id: response._id})
			.select('-__v')
			.populate({
				path: 'operations',
				select: '-__v',
			})
		)
		.then(account => {
			if (!account) return Promise.reject(createError(404, NOT_FOUND));
			res.status(200).json({account: account});
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
}

module.exports = addAccount;
