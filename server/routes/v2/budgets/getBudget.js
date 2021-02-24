const Budget = require('../../../models/budget');
const {isExist, isValidObjectId} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const getBudget = async (req, res, next) => {
	const {
		query: {
			vk_user_id
		},
		params: {
			id
		}
	} = req;
	
	if (!isExist(vk_user_id)) return next(createError(400,  'Отсутствует идентификатор пользователя'));
	if (!isValidObjectId(id)) return next(createError(400,  'Ошибка идентификатора объекта'));

	const filter = {userId: vk_user_id, _id: id};
	
	await Budget.findOne(filter)
		.select('-__v')
		.then(budget => res.status(200).json({budget: budget}))
		.catch(() => next(createError(400, 'Ошибка чтения из БД')));
}

module.exports = getBudget;
