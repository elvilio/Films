const express = require('express');
const bodyParser = require('body-parser');


const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const logDir = 'log';


const app = express();

/* Logging */
/* Create the log directory if it does not exist */
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

const logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			timestamp: tsFormat,
			colorize: true,
			level: 'debug'
		}),
		new (require('winston-daily-rotate-file'))({
			filename: `${logDir}/-results.log`,
			timestamp: tsFormat,
			datePattern: 'yyyy-MM-dd',
			prepend: true,
			level: env === 'development' ? 'silly' : 'debug'
		})
	]
});

module.exports = logger;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Website Routes

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/login', (req, res) => {
	res.sendFile(__dirname + '/client/login.html');
});

app.get('/addfilm', (req, res) => {
	res.sendFile(__dirname + '/client/addNew.html');
});


app.use(express.static(__dirname + '/client'));


/* API Things */
const apiRoute = require('./api.js');

app.use('/api', apiRoute);

app.listen(8080, function () {
	logger.info('Example app listening on port 8080!');
});