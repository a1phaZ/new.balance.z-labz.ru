const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../handlers/logger');

dotenv.config({path: './.env'});

mongoose.Promise = global.Promise;

const dbPath = process.env.MONGODB_URI || `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_PATH}:${process.env.MONGO_PORT}/${process.env.MONGO_BASE}?authSourse=${process.env.MONGO_BASE}`;

mongoose.connect(dbPath, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
mongoose.connection.on('connected', () =>
	logger.debug(`MongoDB connection established successfully`),
);
mongoose.connection.on('disconnected', () =>
	logger.debug(`MongoDB connection close`),
);
mongoose.connection.on(`error`, (e) => {
	logger.debug(`MongoDB connection error`, e);
	process.exit();
});

exports.module = mongoose;