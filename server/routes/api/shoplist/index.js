const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const ShopList = require('../../../models/shoplist');
// const {getState} = require("../state");

router.patch('/', async (req, res, next) => {
	const {
		body: { list },
		query: { vk_user_id }
	} = req;
	const date = new Date().setHours(0,0,0,0);
	const nextDate = new Date().setHours(24, 0, 0, 0);
	const filter = { userId: vk_user_id, date: {$gte: date, $lte: nextDate}}
	await ShopList.findOneAndUpdate(filter, {$set: { list: list }}, {new: true, upsert: true})
		.then(doc => res.json(doc));
}/*, getState*/);

module.exports = router;
