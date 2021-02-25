const Account = require('../../../models/moneybox');
const Item = require('../../../models/item');
const {isExist, isValidFloat, isPositive, isValidLength} = require('../../../handlers/checkInputData');
const {format} = require('date-fns');
const {createError, getMongooseError} = require('../../../handlers/error');

const addAccount = async (req, res, next) => {
	const {
		body: {title, sum, income = true},
		query: {vk_user_id}
	} = req;

	if (!isExist(title)) return next(createError(400, 'Название не должно быть пустым'));
	if (!isExist(sum)) return next(createError(400, 'Сумма не должна быть пустой'));
	if (!isExist(vk_user_id)) return next(createError(400, 'Отсутствует идентификатор пользователя'));
	if (!isValidFloat(sum)) return next(createError(400, 'Ошибка преобразования суммы'));
	if (!isPositive(sum)) return next(createError(400, 'Сумма не должна быть меньше 0'));
	if (!isValidLength(title)) return next(createError(400, 'Превышена допустимая длина названия'));

	const item = new Item({
		date: format(new Date(), 'yyyy-MM-dd'),
		userId: vk_user_id,
		title: `Остаток`,
		price: parseFloat(sum),
		quantity: 1,
		sum: parseFloat(sum),
		income,
	})
		await item.save();

	const account = new Account({
		userId: vk_user_id,
		title,
		sum: 0,
		operations: !!sum ? [item._id] : []
	});
	
	account.$sum = sum || 0;
	account.$income = income;

	await account.save()
		.then(async response => await Account.findById({_id: response._id})
			.select('-__v')
			.populate({
				path: 'operations',
				select: '-__v',
			})
		)
		.then(account => {
			if (!account) return Promise.reject(createError(404, 'Счет не найден'));
			res.status(200).json({account: account});
		})
		.catch(err => {
			if (err.errors) {
				return next(createError(err.statusCode, getMongooseError(err)))
			}
			return next(createError(err.statusCode, err.message))
		});
}

module.exports = addAccount;
