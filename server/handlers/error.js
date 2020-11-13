const createError = (statusCode, message) => {
	const err = new Error(message);
	err.statusCode = statusCode;
	return err;
}

const handleError = (err, res) => {
	const { statusCode, message } = err;
	res.status(statusCode || 500);
	res.send({
		success: false,
		data: null,
		error: {
			statusCode,
			message
		},
	});
}

const getMongooseError = (err) => {
	return Object.values(err.errors).map((item) => item.message).join(' | ');
}

module.exports = {
	createError,
	handleError,
	getMongooseError
}