const express = require('express');
const router = express.Router();
const logger = require('../../../handlers/logger');
const MoneyBox = require('../../../models/moneybox');
const {createError} = require('../../../handlers/error');

router.get('/', (req, res) => {
	logger.info('moneybox get');
	res.json({ok: true});
});

router.post('/', async (req, res, next) => {
	const {
		body: {title, sum},
		query: {vk_user_id}
	} = req;

	const operation = {
		title: `Приход: ${sum}`,
		income: true,
		date: new Date()
	}
	const moneyBox = new MoneyBox({
		userId: vk_user_id,
		title,
		sum: sum || 0,
		operations: !!sum ? [operation] : []
	});

	await moneyBox
		.save()
		.then((response) => {
			res.status(200).json(response);
		})
		.catch(err => next(createError(err.statusCode, err.message)));
});
//
// router.patch('/:id', (req, res, next) => {
//
// })
//
// router.delete('/:id', (req, res, next) => {
//
// });


module.exports = router;