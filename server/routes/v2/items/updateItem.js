const Item = require('../../../models/item');
const Account = require('../../../models/moneybox');
const {checkItemData} = require("../../../handlers/checkInputData");
const {INVALID_ID} = require("../../../const/errors");
const {isValidObjectId} = require("../../../handlers/checkInputData");
const compareObjects = require('../../../handlers/compareObjects');
const {catchError} = require("../../../handlers/error");

const removeItemsFromAccount = async (userId, oldItem) => {
	return await Account.findOne({userId: userId, operations: oldItem._id})
		.then(box => {
			if (!box) {
				return Promise.reject(createError(404, 'Счет не найден'));
			}
			return box;
		})
		.then(async account => {
			const index = account.operations.findIndex((item) => {
				return item.toString() === oldItem._id.toString()
			});
			account.operations = [...account.operations.slice(0, index), ...account.operations.slice(index+1, account.operations.length)];
			account.$sum = -1*(oldItem.sum);
			account.$income = oldItem.income;
			return await account.save();
		})
}

const addItemsToAccount = async (userId, item) => {
	return await Account.findOne({userId: userId, _id: item.itemFrom})
		.then(async account => {
			if (!account) {
				return Promise.reject(createError(404, 'Счет не найден'));
			}
			account.operations = [...account.operations, item._id];
			account.$sum = account.sum;
			account.$income = account.income;
			return await account.save();
		})
}

const updateItem = async (req, res, next) => {
	const {
		params: {id},
		body: {
			date,
			title,
			description,
			price,
			quantity,
			income = false,
			tags,
			itemFrom,
			boxPrice = false
		},
		query: {vk_user_id}
	} = req;
	
	if (!isValidObjectId(id)) return next(createError(400,  INVALID_ID));
	const dataToCheck = {...req.body, vk_user_id};
	await checkItemData(dataToCheck);
	
	const oldItem = await Item.findOne({userId: vk_user_id, _id: id});
	const notEqualProperty = compareObjects(req.body, oldItem);
	
	if (notEqualProperty.length !== 0) {
		const newItem = await Item.findOneAndUpdate({userId: vk_user_id, _id: id}, {
			$set: {
				date,
				title,
				month: new Date(date).getMonth(),
				year: new Date(date).getFullYear(),
				description,
				price: parseFloat(price),
				quantity: parseFloat(quantity),
				income,
				sum: (parseFloat(price) * parseFloat(quantity)).toFixed(2),
				tags,
				itemFrom,
				boxPrice
			}
		}, {new: true})
			.catch(err => catchError(err, next));
		
		console.log(notEqualProperty, notEqualProperty.includes('itemFrom'));
		
		if (notEqualProperty.includes('itemFrom')) {
			await removeItemsFromAccount(vk_user_id, oldItem).catch(err => catchError(err, next));
			await addItemsToAccount(vk_user_id, newItem).catch(err => catchError(err, next));
		}
		
		const filter = {userId: vk_user_id, _id: oldItem.itemFrom};
		
		const currentMonth = new Date(date).getMonth();
		const currentYear = new Date(date).getFullYear();
		
		await Account.findOne(filter)
			.select('-__v')
			.populate({
				path: 'operations',
				match: {year: {$eq: currentYear}, month: {$eq: currentMonth}},
				select: '-__v',
			})
			.then(account => res.status(200).json({account: account}))
			.catch(err => catchError(err, next));
	}
	
	return res.status(200).send();
}

module.exports = updateItem;