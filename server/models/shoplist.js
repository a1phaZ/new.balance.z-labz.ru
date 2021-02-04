const mongoose = require('mongoose');
const { Schema, model } = mongoose;
mongoose.Promise = global.Promise;

const ShopListSchema = new Schema({
	list: [{
		title: {type: String, required: true},
	}]
}, {timestamps: true});

const ShopList = model('ShopList', ShopListSchema);

module.exports = ShopList;
