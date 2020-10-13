const mongoose = require('mongoose');
const { Schema, model} = mongoose;
mongoose.Promise = global.Promise;

const MoneyBoxSchema = new Schema({
	userId: {type: Number, required: [true, 'Отсутствует идентификатор пользователя']},
	title: {type: String, required: [true, 'Отсутствует название']},
	sum: {type: Number, default: 0},
	operations: [{type: Schema.Types.ObjectId, ref: 'Item'}]
});

MoneyBoxSchema.pre('save', function (next) {
	this.sum = this.$income ? this.sum + this.$sum : this.sum - this.$sum;
	next();
});

const MoneyBox = model('MoneyBox', MoneyBoxSchema);

module.exports = MoneyBox;
