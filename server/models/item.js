const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const {format} = require('date-fns');
mongoose.Promise = global.Promise;

const ItemSchema = new Schema({
	userId: {type: String, required: [true, 'Отсутствует идентификатор пользователя']},
	date: {type: String, default: format(new Date(), 'yyyy-MM-dd')},
	month: {type: Number},
	year: {type: Number},
	title: {type: String, required: [true, 'Отсутствует название']},
	description: {type: String, default: ''},
	price: {type: Number, required: [true, 'Отсутствует цена']},
	quantity: {type: Number, required: [true, 'Отсутствует кол-во']},
	sum: {type: Number, required: true},
	income: {type: Boolean, default: false},
	tags: {type: Array, default: []},
	itemFrom: {type: Schema.Types.ObjectId, ref: 'MoneyBox'}
});

ItemSchema.pre('save', function (next) {
	this.month = new Date(this.date).getMonth();
	this.year = new Date(this.date).getFullYear();
	next();
});

const Item = model('Item', ItemSchema);

module.exports = Item;
