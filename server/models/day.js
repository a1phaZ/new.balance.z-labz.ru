const mongoose = require('mongoose');
const {Schema, model} = mongoose;
const {format} = require('date-fns');

mongoose.Promise = global.Promise;

const DaySchema = new mongoose.Schema({
	userId: {type: Number, required: true},
	date: {type: String, default: format(new Date(), 'yyyy.MM.dd')},
	totalSum: {type: Number},
	items: [
		{
			title: {type: String, required: true},
			description: {type: String, default: ''},
			price: {type: Number, required: true},
			quantity: {type: Number, required: true},
			sum: {type: Number, required: true},
			income: {type: Number, default: false},
			tags: {type: Array, default: []},
			itemFrom: {type: Schema.Types.ObjectId, ref: 'MoneyBox'}
		}
	]
});

const calcSum = (array) => {
	let totalSum = 0;
	array.forEach(async item => {
		if (item.income) {
			totalSum += item.sum;
		} else {
			totalSum -= item.sum;
		}
	});
	return totalSum;
}

DaySchema.pre('save', async function save(next) {
	const day = this;
	day.totalSum = calcSum(day.items);
	next();
});

DaySchema.pre('updateOne', async function updateOne(next) {
	const day = this;
	const { items } = day._update.$set;
	const sumArray = [...items];
	const totalSum = calcSum(sumArray);
	day.set({totalSum: totalSum});
	next();
});

const Day = model('Day', DaySchema);

module.exports = Day;
