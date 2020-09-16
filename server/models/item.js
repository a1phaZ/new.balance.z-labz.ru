const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const {format} = require('date-fns');
mongoose.Promise = global.Promise;

const ItemSchema = new Schema({
	userId: {type: String, required: true},
	date: {type: String, default: format(new Date(), 'yyyy.MM.dd')},
	title: {type: String, required: true},
	description: {type: String, default: ''},
	price: {type: Number, required: true},
	quantity: {type: Number, required: true},
	sum: {type: Number, required: true},
	income: {type: Boolean, default: false},
	tags: {type: Array, default: []},
	itemFrom: {type: Schema.Types.ObjectId, ref: 'MoneyBox'}
});

const Item = model('Item', ItemSchema);

module.exports = Item;
