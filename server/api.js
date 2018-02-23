
const R = require('ramda');
const fs = require('fs');
const moment = require('moment');

const axios = require('axios');

const express = require('express');
const router = express.Router();

const storeManager = require('./store.js');

const API_KEYS = {
	imdb: fs.readFileSync(__dirname + '/tmdb.apikey', 'utf8'),
}

router.get('/films', (req, res) => {

	let films = storeManager.store.films;
	
	res.json(films);

});

router.post('/film/add', (req, res) => {

	let { filmID, userID, addedOn, external } = req.body;

	if (storeManager.store.films[filmID]) {
		res.status(410).json('film already present!')
	}
	else {

		// Creating the film
		storeManager.store.films[filmID] = {
			id: filmID,
			addedBy: userID,
			addedOn: addedOn || moment().format('YYYY/MM/DD HH:mm'),
			votedBy: [ ],
		};

		// Adding additional field if not external
		if (!external) {
			axios.get(`https://api.themoviedb.org/3/movie/${ filmID }?api_key=${ API_KEYS.imdb }`)
				.then(req => {
					storeManager.store.films[filmID].name = req.data.title;
					storeManager.store.films[filmID].image = req.data.poster_path;
					res.sendStatus(200);
				})
				.catch(err => {
					console.log('Error during request for "' + filmID + '" provided by user ' + storeManager.store.users[userID]);
					res.sendStatus(500);
				});

		}

		storeManager.saveStore();
	}

});

router.post('/film/vote', (req, res) => {
	let { filmID, userID } = req.body;

	// if one is not present return 404
	if (!storeManager.store.films[filmID] || !storeManager.store.users[userID]) {
		res.sendStatus(404);
	}
	else {
		let film = storeManager.store.films[filmID];
		let user = storeManager.store.users[userID];
		
		film.votedBy.push(userID);
		user.votedFilms.push(filmID);

		storeManager.saveStore();

		res.sendStatus(200);
	}

});

router.get('/users', (req, res) => {

	let users = storeManager.store.users;
	let reducedUsers = R.pipe(
		R.values,
		R.map(it => R.pick(['id', 'name'], it))
	)(users);

	res.json(reducedUsers);

});

router.get('/user/:id', (req, res) => {
	
	let userID = req.params.id;
	let user = storeManager.store.users[userID];
	let reducedUser = R.pick(['id', 'name'], user);

	res.json(reducedUser);
});

router.get('/apikey', (req, res) => {
	res.json(API_KEYS);
});

module.exports = router;