const Budget = require('../../../models/budget');
const {NOT_EXIST, INVALID_ID, NOT_FOUND} = require("../../../const/errors");
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
	
	if (!isExist(vk_user_id)) return next(createError(400,  NOT_EXIST));
	if (!isValidObjectId(id)) return next(createError(400,  INVALID_ID));

	const filter = {userId: vk_user_id, _id: id};
	
	await Budget.findOne(filter)
		.select('-__v')
		.then(budget => {
			if (!budget) return Promise.reject(createError(404, NOT_FOUND));
			return res.status(200).json({budget: budget})
		})
		.catch((err) => next(createError(err.statusCode, err.message)));
}

module.exports = getBudget;
