const R = require('ramda');
const fs = require('fs');
const moment = require('moment');

const axios = require('axios');

const express = require('express');
const router = express.Router();

const storeManager = require('./store.js');

const API_KEYS = {
	tmdb: fs.readFileSync(__dirname + '/tmdb.apikey', 'utf8'),
}

const ACTIONS = require('./client/actions.js');
const handlers = {
	[ACTIONS.GET_FILMS]: (data) => {
		return storeManager.store.films;
	},
	[ACTIONS.GET_USERS]: (data) => {
		return storeManager.store.users;
	},
	[ACTIONS.ADD_FILM]: ({ filmID, userID, external, ...options }) => {
		if (storeManager.store.films[filmID]) {
			return { error: 'film already present' };
		}
		else if (!storeManager.store.users[userID]) {
			return { error: 'invalid user' };
		}
		else {
			if (Object.keys(options).length > 10) {
				throw 'Forse "' + userID + '" sta tentanto di hackerare qualcosa...'
				return { error: 'internal error' };
			}

			storeManager.store.films[filmID] = {
				filmID,
				addedBy: userID,
				addedOn: moment().format('YYYY/MM/DD HH:mm'),
				votedBy: [ ],
				...options,
			}

			if (!external) {
				axios.get(`https://api.themoviedb.org/3/movie/${ filmID }?language=it-IT&api_key=${ API_KEYS.tmdb }`)
					.then(req => {
						// retrive name and image and save the store to disk
						storeManager.store.films[filmID].title = req.data.title;
						storeManager.store.films[filmID].image = req.data.poster_path ? req.data.poster_path : 'https://via.placeholder.com/200x350';
						storeManager.saveStore();
						res.sendStatus(200);
					})
					.catch(err => {
						console.log('Error during request for "' + filmID + '" provided by user ' + userID);
						console.log(err);
						res.sendStatus(500);
					});
			}
			else {
				// adds the name passed by the user and saves the store to disk
				storeManager.saveStore();
			}

			return { success: 'film added' }
		}
	},
	[ACTIONS.GET_APIKEYS]: (data) => {
		return API_KEYS;
	}
}

router.post('/', (req, res) => {
	let handler = handlers[req.body.action];

	if (handler) {
		let res = handler(req.body.data);
		console.log('[' + req.body.action + ']', res);
		res.json(res);
	}
	else {
		res.sendStatus(404);
		throw 'Handle for provided action "' + req.body.action + '" not defined!';
	}
});

router.post('/film/add', (req, res) => {

	let { filmID, userID, addedOn, external, name } = req.body;

	if (storeManager.store.films[filmID]) {
		res.status(410).json('film already present!')
	}
	else {

		// Creating the film
		storeManager.store.films[filmID] = {
			id: filmID,
			addedBy: userID,
			addedOn: addedOn || moment().format('YYYY/MM/DD HH:mm'),
			votedBy: { },
			seen: "False",
		};

		// Adding additional field if not external
		if (!external) {
			axios.get(`https://api.themoviedb.org/3/movie/${ filmID }?language=it-IT&api_key=${ API_KEYS.tmdb }`)
				.then(req => {
					// retrive name and image and save the store to disk
					storeManager.store.films[filmID].title = req.data.title;
					storeManager.store.films[filmID].image = req.data.poster_path ? req.data.poster_path : 'https://via.placeholder.com/200x350';
					storeManager.saveStore();
					res.sendStatus(200);
				})
				.catch(err => {
					console.log('Error during request for "' + filmID + '" provided by user ' + userID);
					console.log(err);
					res.sendStatus(500);
				});
		}
		else {
			// adds the name passed by the user and saves the store to disk
			storeManager.store.films[filmID].title = title;
			storeManager.saveStore();
		}

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
		
		film.votedBy[userID] = 1;
		user.votedFilms[filmID] = 1;

		storeManager.saveStore();

		res.sendStatus(200);
	}

});

router.post('/film/unvote', (req, res) => {
	let { filmID, userID } = req.body;

	
	// if one is not present return 404
	if (!storeManager.store.films[filmID] || !storeManager.store.users[userID]) {
		res.sendStatus(404);
	}
	else {
		let film = storeManager.store.films[filmID];
		let user = storeManager.store.users[userID];
		
		delete film.votedBy[userID];
		delete user.votedFilms[filmID];
		
		storeManager.saveStore();

		res.sendStatus(200);
	}

})

router.get('/users', (req, res) => {

	let users = storeManager.store.users;
	let reducedUsers = R.pipe(
		R.values,
		R.map(it => R.pick(['id', 'name'], it))
	)(users);

	res.json(reducedUsers);

});

router.get('/user/:id', (req, res) => {

	let authUserID = req.query.auth;

	let userID = req.params.id;
	let user = storeManager.store.users[userID];
	
	if (authUserID === userID) {
		res.json(user);
	}
	else if (user) {
		let reducedUser = R.pick(['id', 'name'], user);
		res.json(reducedUser);
	}
	else {
		res.json('user not found');
	}

});

module.exports = router;
