const Account = require('../../../models/moneybox');
const Item = require('../../../models/item');
const {checkAccountData} = require('../../../handlers/checkInputData');
const {format} = require('date-fns');
const {catchError} = require('../../../handlers/error');
const sortByDate = require('../../../handlers/sortByDate');

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
	
	await account.save();
	const filter = {userId: vk_user_id}
	await Account.find(filter)
		.select('-__v -operations')
		.then(accounts => res.status(200).json({accounts: accounts.sort(sortByDate)}))
		.catch((err) => catchError(err, next));
}

module.exports = addAccount;
