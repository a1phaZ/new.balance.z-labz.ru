const mongoose = require('mongoose');
const { model, Schema } = mongoose;
mongoose.Promise = global.Promise;

const BudgetSchema = new Schema({
	userId: {type: String, required: true},
	title: {type: String, required: true},
	monthlyBudget : [
		{
			month: {type: Number},
			year: {type: Number},
			sum: {type: Number, required: true},
		}
	],
});

const Budget = model('Budget', BudgetSchema);

module.exports = Budget;
