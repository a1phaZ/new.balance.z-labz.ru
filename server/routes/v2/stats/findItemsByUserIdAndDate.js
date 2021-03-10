const Item = require('../../../models/item');
const {isExist, isValidDate} = require("../../../handlers/checkInputData");
const {INVALID_DATE, NOT_EXIST} = require("../../../const/errors");

const findItemsByUserIdAndDate = async (req, res, next) => {
	const {
		query: {
			vk_user_id,
			date = new Date()
		}
	} = req;
	if (!isExist(vk_user_id)) return next(createError(400, NOT_EXIST));
	if (!isValidDate(date)) return next(createError(400, INVALID_DATE));
	
	const currentMonth = new Date(date).getMonth();
	const currentYear = new Date(date).getFullYear();
	const filter = {userId: vk_user_id, year: {$eq: currentYear}, month: {$eq: currentMonth}};
	
	req.items = await Item.find(filter);
	
	next();
}

module.exports = findItemsByUserIdAndDate;
