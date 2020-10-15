export default (e) => {
	const validity = e.currentTarget.validity;
	if (validity.valid) {
		return {status: 'valid', message: null}
	} else {
		if (validity.badInput) {
			return {status: 'error', message: 'Неверный формат ввода'}
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
		return {status: 'default', message: null}
	}
}