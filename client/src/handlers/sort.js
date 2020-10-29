import compareAsc from "date-fns/compareAsc";

export default function (a, b){
	const aDate = new Date(a.date);
	const bDate = new Date(b.date);
	return compareAsc(bDate, aDate);
}