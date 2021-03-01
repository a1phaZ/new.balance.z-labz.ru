export default (number) => {
	return new Intl.NumberFormat('ru-RU', {style: 'currency', currency: 'RUB'}).format(number);
}