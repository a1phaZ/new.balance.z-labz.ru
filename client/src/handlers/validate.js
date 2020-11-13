export default (e) => {
	const validity = e.currentTarget.validity;
	if (validity.valid && e.currentTarget.value !== ' ') {
		return {status: 'valid', message: null}
	} else {
		if (validity.badInput || validity.valueMissing || e.currentTarget.value === ' ') {
			return {status: 'error', message: 'Неверный формат ввода | Отсутствует значение'}
		}
		if (validity.tooLong) {
			return {status: 'error', message: 'Превышена максимальная длина'}
		}
		if (validity.typeMismatch) {
			return {status: 'error', message: 'Несоответствие типа'}
		}
		if (validity.rangeOverflow) {
			return {status: 'error', message: 'Слишком большое число'}
		}
		if (validity.rangeUnderflow) {
			return {status: 'error', message: 'Нельзя вводить отрицательные числа'}
		}

		return {status: 'default', message: null}
	}
}