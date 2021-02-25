const Budget = require('../../../models/budget');
const {isValidFloat, isExist, isPositive, isValidLength} = require('../../../handlers/checkInputData');
const {setErrorStatusCodeAndMessage, getMongooseError, createError} = require("../../../handlers/error");

const addBudget = async (req, res, next) => {
	const {
		query: {vk_user_id},
		body: {title, sum}
	} = req;
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	if (!isExist(title)) return next(createError(400, 'Название не должно быть пустым'));
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isValidLength(title)) return next(createError(400, 'Превышена допустимая длина названия'));
	if (!isExist(sum)) return next(createError(400, 'Сумма не должна быть пустой'));
	if (!isValidFloat(sum)) return next(createError(400, 'Ошибка преобразования суммы'));
	if (!isPositive(sum)) return next(createError(400, 'Сумма должна быть больше 0'));
	
	const filter = {userId: vk_user_id, title: title, month: month, year: year};
	
	await Budget.findOne(filter)
		.then((budget) => {
			if (budget) {
				return next(createError(400, `${title} уже добавален, укажите другое название`));
			}
		});
	
	const newBudget = new Budget({
		userId: vk_user_id,
		title: title,
		month: month,
		year: year,
		sum: parseFloat(sum) ? parseFloat(sum) : 0,
	})
	await newBudget.save();
	
	await Budget.findOne(filter)
		.select('-__v')
		.then((budget) => res.status(200).json({budget: budget}))
		.catch(err => {
			if (err.errors) {
				return next(createError(400, getMongooseError(err)))
			}
			if (err.reason) {
				const e = setErrorStatusCodeAndMessage(err);
				next(createError(e.statusCode, e.message));
			}
			return next(createError(err.statusCode, err.message))
		});
}

module.exports = addBudget;