const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const logger = require('./handlers/logger');
const {handleError, createError} = require("./handlers/error");

dotenv.config();
const app = express();
require('./config/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

if (process.env.STATUS !== 'dev') {
	app.use(require('./handlers/compareSign'));
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
