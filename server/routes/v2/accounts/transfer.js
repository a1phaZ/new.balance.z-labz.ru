const {itemSaveAndUpdateAccount} = require("../../../handlers/itemSaveAndUpdateAccount");
const Item = require('../../../models/item');
const {checkItemData} = require("../../../handlers/checkInputData");
const {NOT_EXIST} = require("../../../const/errors");
const {isExist} = require('../../../handlers/checkInputData');
const {format} = require('date-fns');

const transfer = async (req, res, next) => {
	const {
		body: {
			date,
			title,
			description = '',
			price,
			tags = [],
			from,
			to,
			boxPrice = false
		},
		query: {vk_user_id, tzOffset = 0}
	} = req;
	
	const d = new Date(date);
	d.setTime( d.getTime() + tzOffset*60*1000 );
	
	if (!isExist(from) || !isExist(to)) return next(createError(400, NOT_EXIST));
	
	checkItemData({...req.body, vk_user_id, itemFrom: to, quantity: 1});

	const itemTo = new Item({
		date: format(date ? new Date(date) : new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price: parseFloat(price),
		quantity: 1,
		income: true,
		tags,
		itemFrom: to,
		boxPrice
	});
	const itemFrom = new Item({
		date: format(date ? new Date(date) : new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title,
		description,
		price: parseFloat(price),
		quantity: 1,
		income: false,
		tags,
		itemFrom: from,
		boxPrice
	});
	
	const accountTo = await itemSaveAndUpdateAccount(itemTo, vk_user_id, to);
	const accountFrom = await itemSaveAndUpdateAccount(itemFrom, vk_user_id, from);
	
	if (accountFrom.statusCode) {
		return next(accountFrom);
	}
	if (accountTo.statusCode) {
		return next(accountTo);
	}
	
	return res.status(200).json('Перевод совершен');
}

module.exports = transfer;
