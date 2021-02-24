const {itemSaveAndUpdateAccount} = require("../../../handlers/itemSaveAndUpdateAccount");
const Item = require('../../../models/item');
const {isExist, isValidFloat, isPositive, isFutureDate, isValidDate, isValidObjectId} = require('../../../handlers/checkInputData');
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
	
	if (!isExist(title)) return next(createError(400, 'Название не должно быть пустым'));
	if (!isValidFloat(price)) return next(createError(400, 'Ошибка преобразования цены'));
	if (!isPositive(price)) return next(createError(400, 'Сумма не должна быть меньше 0'))
	if (isFutureDate(d)) return next(createError(400,  'Дата в будущем'));
	if (!isValidDate(new Date(date))) return next(createError(400,  'Дата невалидна'));
	if (!isExist(from) || !isExist(to)) return next(createError(400, 'Отсутствует идентификатор счета'));
	if (!isValidObjectId(to) || !isValidObjectId(from)) return next(createError(400,  'Ошибка идентификатора счета'));
	
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
