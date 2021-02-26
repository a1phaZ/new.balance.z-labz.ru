const Budget = require('../../../models/budget');
const {SAME_VALUE} = require("../../../const/errors");
const {checkBudgetData} = require('../../../handlers/checkInputData');
const {createError, catchError} = require("../../../handlers/error");

const addBudget = async (req, res, next) => {
	const {
		query: {vk_user_id},
		body: {title, sum}
	} = req;
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth();
	
	const dataToCheck = {...req.body, vk_user_id};
	await checkBudgetData(dataToCheck, next);
	
	const filter = {userId: vk_user_id, title: title, month: month, year: year};
	
	await Budget.findOne(filter)
		.then((budget) => {
			if (budget) {
				return next(createError(400, `${title} ${SAME_VALUE}`));
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
		.catch(err => catchError(err, next));
}

module.exports = addBudget;