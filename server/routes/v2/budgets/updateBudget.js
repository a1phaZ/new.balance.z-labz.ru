const Budget = require('../../../models/budget');
const {INVALID_ID, SAME_VALUE, NOT_FOUND} = require("../../../const/errors");
const {isValidObjectId, checkBudgetData} = require('../../../handlers/checkInputData');
const {createError, catchError} = require("../../../handlers/error");

const updateBudget = async (req, res, next) => {
	const {
		params: {id},
		query: {vk_user_id},
		body: {title, sum}
	} = req;
	
	if (!isValidObjectId(id)) return next(createError(400,  INVALID_ID));
	const dataToCheck = {...req.body, vk_user_id};
	await checkBudgetData(dataToCheck, next);
	
	await Budget.findOne({userId: vk_user_id, title: title})
		.then(budget => {
			if (budget) return next(createError(400, `${title} ${SAME_VALUE}`));
		})
	
	await Budget.findOneAndUpdate({_id: id, userId: vk_user_id}, {
		$set: {
			title,
			sum: parseFloat(sum)
		}
	}, {new: true})
		.select('-__v')
		.then(budget => {
				if (!budget) return Promise.reject(createError(404, NOT_FOUND));
				return res.status(200).json({budget: budget})
			}
		)
		.catch(err => catchError(err, next));
}

module.exports = updateBudget;
