const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const logger = require('./handlers/logger');
const {handleError, createError} = require("./handlers/error");
const rateLimiterMiddleware = require('./handlers/rateLimiterMiddleware');

dotenv.config();
const app = express();
require('./config/db');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if (process.env.STATUS !== 'dev') {
	app.use(require('./handlers/compareSign'));
	app.use(rateLimiterMiddleware);
}

app.use(require('./routes'));

app.use(function (req, res, next) {
	next(createError(404, 'Запрашиваемый адрес не найден'));
});

// error-box handler
app.use((err, req, res, next) => {
	handleError(err, res)
});

const server = app.listen(process.env.PORT || 3000, () => {
	logger.debug('Server start at port:' + server.address().port);
});

module.exports = app;
