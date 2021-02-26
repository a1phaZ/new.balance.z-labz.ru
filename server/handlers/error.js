const setErrorStatusCodeAndMessage = err => {
	try {
		const {reason: {
			code
		}} = err;
		switch (code) {
			case 'ERR_ASSERTION':
				return {
					statusCode: 400, message: 'Введенные данные некорректны'
				};
		}
	} catch (e) {
		console.log(e);
		return null
	}
}

const createError = (statusCode, message) => {
	const err = new Error(message);
	err.statusCode = statusCode;
	return err;
}

const handleError = (err, res) => {
	const { statusCode, message } = err;
	res.status(statusCode || 500);
	res.send({
		error: {
			statusCode,
			message
		},
	});
}

const getMongooseError = (err) => {
	return Object.values(err.errors)
		.map((item) => {
			if (item.kind === 'ObjectId') {
				return 'Невозможно преобразовать идентификатор'
			}
			if (!!item.reason) {
				return setErrorStatusCodeAndMessage(item).message
			}
			return item.message
		})
		.join(' | ');
}

const catchError = (err, next) => {
	if (err.errors) {
		return next(createError(400, getMongooseError(err)))
	}
	if (err.reason) {
		const e = setErrorStatusCodeAndMessage(err);
		next(createError(e.statusCode, e.message));
	}
	return next(createError(err.statusCode, err.message))
}

module.exports = {
	createError,
	handleError,
	getMongooseError,
	setErrorStatusCodeAndMessage,
	catchError
}