const R = require('ramda');
const _ = require('lodash');
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
	
	[ACTIONS.GET_FILMS]: () => {
		return storeManager.store.films;
	},
	
	[ACTIONS.GET_USERS]: () => {
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
						storeManager.store.films[filmID].image = 
							req.data.poster_path ? req.data.poster_path : 'https://via.placeholder.com/200x350';
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
	
	[ACTIONS.GET_APIKEYS]: () => {
		return API_KEYS;
	},
	
	[ACTIONS.GET_USER]: ({ userID, auth }) => {
		let user = storeManager.store.users[userID];
		
		if (user) {
			if (auth) {
				return user;
			}
			else {
				let reducedUser = R.pick(['id', 'name'], user);
				return reducedUser;
			}
		}
		else {
			return { error: 'user not found' };
		}
	},

	[ACTIONS.ISADMIN]: ({ userID, auth }) => {
		let user = storeManager.store.users[userID];
		return user.Admin;
	},

	[ACTIONS.CHOOSE_RANDOM_SET]: () => {

		storeManager.store.votableFilms = [];
		storeManager.store.nextUp = null;

		_.forEach(storeManager.store.films, (film) => {
			// Reset all films for new poll
			film.votingOpen = false;
			film.nextUp = false;
		});

		let filmList = _.values(storeManager.store.films);
		let unseenFilms = _.filter(filmList, film => !film.seen);
		let random4films = _.sampleSize(unseenFilms, 4);

		random4films.forEach(film => { 
			film.votingOpen = true;
			film.votedBy = [];

			storeManager.store.votableFilms.push(film.id);
		});

		storeManager.saveStore();
		
	},

	[ACTIONS.CLOSE_POLL]: () => {
		
		if (!storeManager.store.votableFilms.length) {
			return { error: 'no poll open' };
		}

		let filmIDVotePairs = storeManager.store.votableFilms.map(filmID => ({ 
			filmID, 
			vote: storeManager.store.films[filmID].votedBy.length,
		}));

		let theRandomFilm = _.maxBy(_.shuffle(filmIDVotePairs), it => it.vote);

		storeManager.store.films[theRandomFilm.filmID].nextUp = true;
		storeManager.store.nextUp = theRandomFilm.filmID;

		storeManager.store.votableFilms.map(filmID => {
			let film = storeManager.store.films[filmID];
			
			if (filmID !== theRandomFilm.filmID) {
				film.votedBy = [];
			}
			
			film.votingOpen = false;
		});

		storeManager.saveStore();

		// TODO: Fixare il fatto che questa cosa potrebbe crashare malamente
		setTimeout(() => {
			// Dopo 10 minuti rimuove il nextUp e lo aggiunge alla lista dei film visti
			storeManager.store.films[theRandomFilm.filmID].nextUp = false;
			storeManager.store.films[theRandomFilm.filmID].seen = true;
			storeManager.store.nextUp = null;

			storeManager.saveStore();

		}, 1000 * 60 * 30 /* = 10 minuti */);
		
	},

	[ACTIONS.GET_NEXTUP]: () => {
		return { nextUp: storeManager.store.nextUp || null };
	}

}

router.post('/', (req, res) => {
	let handler = handlers[req.body.action];

	if (handler) {
		let result = handler(req.body);
		console.log('[' + req.body.action + ']');
		res.json(result);
	}
	else {
		res.sendStatus(500);
		throw 'No handler for "' + req.body.action + '"';
	}
});

router.get('/random-films', (req, res) => {
	handlers[ACTIONS.CHOOSE_RANDOM_SET]();
	res.json({
		success: 'Selected 4 random films for the voting'
	});
});

router.get('/close-poll', (req, res) => {
	handlers[ACTIONS.CLOSE_POLL]();
	res.json({
		success: 'closed the poll'
	});
});

/*
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
*/

module.exports = router;
