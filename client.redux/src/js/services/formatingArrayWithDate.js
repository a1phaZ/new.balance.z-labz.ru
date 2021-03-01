export const ArrayToObjectWithDate = (items) => {
	return items.reduce((prev, curr) => {
		const index = +new Date(curr.date);
		if (prev[index]) {
			prev[index] = [...prev[index], curr];
		} else {
			prev[index] = [curr];
		}
		return prev;
	}, {});
}

export const ObjectToArrayWithDate = (indexAr) => {
	let itemsListArray = [];
	Object.keys(indexAr).forEach(key => {
		const items = indexAr[key];
		let date = '';
		indexAr[key].income = 0;
		indexAr[key].outcome = 0;
		items.forEach(item => {
			date = item.date;
			itemsListArray.splice(0,0, item);
			if (item.income) {
				indexAr[key].income += item.sum;
			} else {
				indexAr[key].outcome += item.sum;
			}
		})
		indexAr[key].income = indexAr[key].income.toFixed(2);
		indexAr[key].outcome = indexAr[key].outcome.toFixed(2);
		itemsListArray.splice(0,0,{date: date, income: indexAr[key].income, outcome: indexAr[key].outcome, caption: true})
	});
	return itemsListArray;
}