const mongoose = require('mongoose');
const { model, Schema } = mongoose;
mongoose.Promise = global.Promise;

const BudgetSchema = new Schema({
	userId: {
		type: String,
		required: [true, 'Отсутствует идентификатор пользователя']
	},
	title: {
		type: String,
		required: [true, 'Отсутствует название'],
		maxlength: [20, 'Слишком длинное название'],
		minlength: [1, 'Название не должно быть пустым']
	},
	month: {type: Number},
	year: {type: Number},
	sum: {
		type: Number,
		required: [true, 'Сумма обязательна'],
		min: [0, 'Значение суммы должно быть больше либо равно 0']
	},
});

const Budget = model('Budget', BudgetSchema);

module.exports = Budget;
