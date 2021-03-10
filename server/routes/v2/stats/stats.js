const statsByTitle = (array) => {
	return array.sort((a, b) => a.title.localeCompare(b.title)).reduce((prev, curr) => {
		if (prev[prev.length - 1] && prev[prev.length - 1].title === curr.title) {
			const prevItem = prev[prev.length - 1];
			prevItem.sum = prevItem.sum + curr.sum;
			prevItem.quantity += curr.quantity;
			const array = [...prev.slice(0, prev.length - 1), prevItem];
			return [...array];
		} else {
			return [...prev, {title: curr.title, sum: curr.sum, quantity: curr.quantity}];
		}
	}, []);
}

const getTagsListItems = (array) => {
	const tagsListItems = {};
	
	if (!Array.isArray(array)) {
		return array
	}
	
	array.forEach(operation => {
		const {tags} = operation;
		if (tags.length === 0) {
			if (!tagsListItems['Без тега']) {
				tagsListItems['Без тега'] = [operation]
			} else {
				tagsListItems['Без тега'] = [...tagsListItems['Без тега'], operation];
			}
		} else {
			tags.forEach(tag => {
				if (!tagsListItems[tag]) {
					tagsListItems[tag] = [operation];
				} else {
					tagsListItems[tag] = [...tagsListItems[tag], operation];
				}
			})
		}
	});
	return tagsListItems;
}

const stats = async (req, res) => {
	const {
		query: { sort },
		items
	} = req;
	
	if (sort === 'tags') {
		return res.status(200).json(getTagsListItems(items));
	}
	if (sort === 'title') {
		return res.status(200).json(statsByTitle(items));
	}
	
	return res.status(200).json([]);
}

module.exports = stats;
