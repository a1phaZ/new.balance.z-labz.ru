const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const {createError} = require("./error");
const connection = mongoose.connection;

const opt = {
	storeClient: connection,
	keyPrefix: 'middleware',
	points: 5,
	duration: 1,
	blockDuration: 2
}

const rateLimiter = new RateLimiterMongo(opt);
const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter.consume(req.ip)
		.then(() => next())
		.catch(() => next(createError(429, 'Слишком много запросов, повторите запрос позже')));
}

module.exports = rateLimiterMiddleware;
