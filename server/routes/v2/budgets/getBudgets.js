const Budget = require('../../../models/budget');
const {isExist, isValidDate, } = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const getBudgets = async (req, res, next) => {
	const {
		query: {
			vk_user_id,
			date = new Date()
		}
	}	= req;
	
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isValidDate(date)) return next(createError(400, 'Ошибка даты'));
	
	const currentMonth = new Date(date).getMonth();
	const currentYear = new Date(date).getFullYear();
	const filter = {userId: vk_user_id, year: {$eq: currentYear}, month: {$eq: currentMonth}};
	await Budget.find(filter)
		.select('-__v')
		.then(budgets => res.status(200).json({budgets: budgets}))
		.catch(() => next(createError(400, 'Ошибка чтения из БД')));
}

module.exports = getBudgets;
