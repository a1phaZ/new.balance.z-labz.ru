const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const {format} = require('date-fns');
mongoose.Promise = global.Promise;

const ShopListSchema = new Schema({
	userId: {type: String, required: [true, 'Отсутствует идентификатор пользователя']},
	date: {type: String, default: format(new Date(), 'yyyy-MM-dd')},
	list: [{
		id: {type: Number},
		title: {type: String, required: true},
		done: {type: Boolean, default: false}
	}]
});

const ShopList = model('ShopList', ShopListSchema);

module.exports = ShopList;
