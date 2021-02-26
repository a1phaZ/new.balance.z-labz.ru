const Item = require('../../../models/item');
const {isExist, isValidObjectId} = require("../../../handlers/checkInputData");
const {createError} = require('../../../handlers/error');
const {NOT_FOUND, INVALID_ID, NOT_EXIST} = require('../../../const/errors');

const getItem = async (req, res, next) => {
	const {
		query: {
			vk_user_id
		},
		params: {
			id
		}
	}	= req;
	
	if (!isExist(vk_user_id)) return next(createError(400, NOT_EXIST));
	if (!isValidObjectId(id)) return next(createError(400, INVALID_ID));
	
	const filter = {userId: vk_user_id, _id: id};
	
	await Item.findOne(filter)
		.select('-__v')
		.then(item => {
			if (!item) return Promise.reject(createError(404, NOT_FOUND));
			return res.status(200).json({item: item});
		})
		.catch(err => next(createError(err.statusCode, err.message)));
}

module.exports = getItem;
