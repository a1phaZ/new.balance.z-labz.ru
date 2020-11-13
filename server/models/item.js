const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const {format} = require('date-fns');
mongoose.Promise = global.Promise;

const ItemSchema = new Schema({
	userId: {type: String, required: [true, 'Отсутствует идентификатор пользователя']},
	date: {type: String, default: format(new Date(), 'yyyy-MM-dd')},
	month: {type: Number},
	year: {type: Number},
	title: {
		type: String,
		required: [true, 'Отсутствует название'],
		maxlength: [20, 'Слишком длинное название']
	},
	description: {
		type: String,
		default: '',
		maxlength: [70, 'Слишком длинное описание']
	},
	price: {type: Number, required: [true, 'Отсутствует цена']},
	quantity: {type: Number, required: [true, 'Отсутствует кол-во']},
	sum: {type: Number, default: 0},
	income: {type: Boolean, default: false},
	tags: {type: Array, default: []},
	itemFrom: {type: Schema.Types.ObjectId, ref: 'MoneyBox'}
});

ItemSchema.pre('save', function (next) {
	this.month = new Date(this.date).getMonth();
	this.year = new Date(this.date).getFullYear();
	this.sum = this.price * this.quantity;
	next();
});

const Item = model('Item', ItemSchema);

module.exports = Item;
