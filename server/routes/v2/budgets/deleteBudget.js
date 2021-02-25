const Budget = require('../../../models/budget');
const {isValidObjectId, isExist} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const deleteBudget = async (req, res, next) => {
	const {
		query: {vk_user_id},
		params: {id}
	} = req;
	
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isValidObjectId(id)) return next(createError(400,  'Ошибка идентификатора объекта'));
	const filter = {userId: vk_user_id, _id: id};
	const budget = await Budget.findOne(filter);
	if (!budget) return next(createError(404, 'Бюджет не найден'));
	Budget.deleteOne(filter)
		.then(() => res.status(200).json({budget: null, message: 'Бюджет удалён'}))
		.catch(err => next(createError(err.statusCode, err.message)));
}

module.exports = deleteBudget;
