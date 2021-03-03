const {format} = require('date-fns');
const Item = require('../../../models/item');
const Account = require('../../../models/moneybox');

const {NOT_FOUND} = require("../../../const/errors");
const {checkItemData} = require("../../../handlers/checkInputData");
const {createError, catchError} = require('../../../handlers/error');

const addItem = async (req, res, next) => {
	const {
		body: {
			date,
			title,
			description = '',
			price,
			quantity,
			income = false,
			tags = [],
			itemFrom,
			boxPrice = false
		},
		query: {vk_user_id}
	} = req;
	
	const dataToCheck = {...req.body, vk_user_id};
	await checkItemData(dataToCheck, next);
	
	const item = new Item({
		date: format(date ? new Date(date) : new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price: parseFloat(price),
		quantity: parseFloat(quantity),
		income,
		tags,
		itemFrom,
		boxPrice
	});
	
	await item.save().catch(err => catchError(err, next));
	const filter = {userId: vk_user_id, _id: itemFrom};
	const account = await Account.findOne(filter).catch(err => catchError(err, next));
	
	if (!account) return next(createError(404, NOT_FOUND));
	account.operations = [...account.operations, item._id];
	account.$sum = item.sum;
	account.$income = item.income;
	await account.save().catch(err => catchError(err, next));
	
	const currentMonth = new Date(date).getMonth();
	const currentYear = new Date(date).getFullYear();
	
	await Account.findOne(filter)
		.select('-__v')
		.populate({
			path: 'operations',
			match: {year: {$eq: currentYear}, month: {$eq: currentMonth}},
			select: '-__v',
		})
		.then(account => res.status(200).json({account: account}))
		.catch(err => catchError(err, next));
}

module.exports = addItem;