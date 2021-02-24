const Budget = require('../../../models/budget');
const {isValidFloat, isExist, isPositive, isValidObjectId, isValidLength} = require('../../../handlers/checkInputData');
const {getMongooseError, createError} = require("../../../handlers/error");

const updateBudget = async (req, res, next) => {
	const {
		params: {id},
		query: {vk_user_id},
		body: {title, sum}
	} = req;
	
	if (!isValidObjectId(id)) return next(createError(400,  'Ошибка идентификатора объекта'));
	if (!isExist(title)) return next(createError(400, 'Название не должно быть пустым'));
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isExist(sum)) return next(createError(400, 'Сумма не должна быть пустой'));
	if (!isValidFloat(sum)) return next(createError(400, 'Ошибка преобразования суммы'));
	if (!isPositive(sum)) return next(createError(400, 'Сумма не должна быть меньше 0'));
	if (!isValidLength(title)) return next(createError(400, 'Превышена допустимая длина названия'));
	
	await Budget.findOne({userId: vk_user_id, title: title})
		.then(budget => {
			if (budget) return next(createError(400, `${title} уже добавален, укажите другое название`));
		})
	
	await Budget.findOneAndUpdate({_id: id, userId: vk_user_id}, {
		$set: {
			title,
			sum: parseFloat(sum)
		}
	}, {new: true})
		.select('-__v')
		.then(budget => {
				if (!budget) return Promise.reject(createError(404, 'Запрашиваемый бюджет не найден'));
				return res.status(200).json({budget: budget})
			}
		)
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
}

module.exports = updateBudget;
