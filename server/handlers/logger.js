const log4js = require('log4js');

const LOG_PATH = process.env.LOG_PATH || './logs';

log4js.configure({
	appenders: {
		console: { type: 'stdout', layout: { type: 'colored' } },
	},
	categories: {
		default: { appenders: ['console'], level: 'ALL' },
	}
});

const logger = log4js.getLogger('console');
module.exports = logger;