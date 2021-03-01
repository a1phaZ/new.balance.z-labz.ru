const compareAsc = require("date-fns/compareAsc");

module.exports = (a, b) => {
	const aDate = new Date(a.date);
	const bDate = new Date(b.date);
	return compareAsc(bDate, aDate);
}