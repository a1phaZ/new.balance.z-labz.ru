const mongoose = require('mongoose');
const { Types: {ObjectId}} = mongoose;

const compareObjects = (obj1, obj2)  => {
	let notEqualProperty = [];
	
	for (let p in obj1) {
		switch (p) {
			case 'price':
				if (!(parseFloat(obj1[p]) === parseFloat(obj2[p]))) notEqualProperty.push(p);
				break;
			case 'tags':
				if (!(obj1[p].join(' ') === obj2[p].join(' '))) notEqualProperty.push(p);
				break;
			case 'itemFrom':
				if (new ObjectId(obj1[p]).toString() !== new ObjectId(obj2[p]).toString()) notEqualProperty.push(p);
				break;
			case 'params':
				break;
			default:
				if (!(obj1[p] === obj2[p])) notEqualProperty.push(p);
		}
	}
	
	return notEqualProperty;
	
}

module.exports = compareObjects;
