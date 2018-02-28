const express = require('express');
const bodyParser = require('body-parser');

const app = express();

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

// API Things

const apiRoute = require('./api.js');

app.use('/api', apiRoute);

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});
