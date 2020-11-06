const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');
const {createError} = require("./error");
const connection = mongoose.connection;
const dotenv = require('dotenv');
dotenv.config();

const opt = {
	storeClient: connection,
	keyPrefix: 'middleware',
	points: process.env.POINTS || 5,
	duration: process.env.DURATION || 1,
	blockDuration: process.env.BLOCK_DURATION || 2
}

const rateLimiter = new RateLimiterMongo(opt);
const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter.consume(req.ip)
		.then(() => next())
		.catch(() => next(createError(429, 'Слишком много запросов, повторите запрос позже')));
}

module.exports = rateLimiterMiddleware;
