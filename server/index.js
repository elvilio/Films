
const express = require('express');
const app = express();

// Website Routes

app.get('/', (req, res) => {
	res.sendFile('./server/client/index.html');
});

// API Things

const apiRoute = require('./api.js');

app.use('/api', apiRoute);

app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});