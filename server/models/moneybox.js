const mongoose = require('mongoose');
const { Schema, model} = mongoose;
mongoose.Promise = global.Promise;

const MoneyBoxSchema = new Schema({
	userId: {type: Number, required: true},
	title: {type: String, required: true},
	sum: {type: Number, default: 0},
	operations: {type: Array, default: []}
});

const MoneyBox = model('MoneyBox', MoneyBoxSchema);

module.exports = MoneyBox;
