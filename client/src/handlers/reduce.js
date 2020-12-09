import isEqual from "date-fns/isEqual";

export default function (prev, curr) {
	if (isEqual(new Date(prev[prev.length-1]?.date), new Date(curr.date))) {
		return [...prev, curr];
	} else {
		return [...prev, {date: curr.date, caption: true}, curr];
	}
}