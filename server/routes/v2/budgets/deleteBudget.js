const Budget = require('../../../models/budget');
const {NOT_FOUND} = require("../../../const/errors");
const {checkIds} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');

const deleteBudget = async (req, res, next) => {
	const {
		query: {vk_user_id},
		params: {id}
	} = req;
	
	await checkIds(id, vk_user_id, next);
	
	const filter = {userId: vk_user_id, _id: id};
	const budget = await Budget.findOne(filter);
	if (!budget) return next(createError(404, NOT_FOUND));
	Budget.deleteOne(filter)
		.then(() => res.status(200).json({budget: null, message: 'Бюджет удалён'}))
		.catch(err => next(createError(err.statusCode, err.message)));
}

module.exports = deleteBudget;
