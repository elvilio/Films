const R = require('ramda');
const _ = require('lodash');
const fs = require('fs');
const moment = require('moment');

const axios = require('axios');

const express = require('express');
const router = express.Router();

const storeManager = require('./store.js');

const logger = require('./index.js');

const API_KEYS = {
	tmdb: fs.readFileSync(__dirname + '/tmdb.apikey', 'utf8'),
}

const ACTIONS = require('./client/actions.js');
const handlers = {
	
	[ACTIONS.GET_FILMS]: () => {
		logger.silly('[GET_FILMS] Got films from store');
		return storeManager.store.films;
	},
	
	[ACTIONS.GET_USERS]: () => {
		logger.silly('[GET_USERS] Got users from store');
		return storeManager.store.users;
	},
	
	[ACTIONS.ADD_FILM]: ({ filmID, userID, external, ...options }) => {
		if (storeManager.store.films[filmID]) {
			logger.silly('[ADD_FILM] err: film already present');
			return { error: 'film already present' };
		}
		else if (!storeManager.store.users[userID]) {
			logger.silly('[ADD_FILM] err: invalid user');
			return { error: 'invalid user' };
		}
		else {
			if (Object.keys(options).length > 10) {
				throw 'Forse "' + userID + '" sta tentanto di hackerare qualcosa...'
				logger.silly('[ADD_FILM] err: Forse "' + userID + '" sta tentanto di hackerare qualcosa...');
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
						logger.warn('Error during request for "' + filmID + '" provided by user ' + userID);
						logger.warn(err);
						res.sendStatus(500);
					});
			}
			else {
				// adds the name passed by the user and saves the store to disk
				storeManager.saveStore();
			}

			logger.silly('[ADD_FILM] Film added (' + filmID + ')');
			return { success: 'film added' }
		}
	},
	
	[ACTIONS.GET_APIKEYS]: () => {
		logger.silly('[GET_APIKEYS] Got ApiKey');
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
			logger.silly('[GET_USER] err: user not found');
			return { error: 'user not found' };
		}
	},

	[ACTIONS.ISADMIN]: ({ userID, auth }) => {
		let user = storeManager.store.users[userID];
		logger.silly('[ISADMIN] Checked for admin');
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
		logger.info('[CHOOSE_RANDOM_SET] Chose 4 films');
	},

	[ACTIONS.CLOSE_POLL]: () => {
		
		if (!storeManager.store.votableFilms.length) {
			logger.info('[CLOSE_POLL] err: no poll open');
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

		storeManager.store.votableFilms = []; //meglio fare così che se no se la chiami più volte ottieni risultati diversi (se sceglie a random)

		storeManager.saveStore();

		logger.info('[CLOSE_POLL] Closed poll');

		// TODO: Fixare il fatto che questa cosa potrebbe crashare malamente
		setTimeout(() => {
			// Dopo 10 minuti rimuove il nextUp e lo aggiunge alla lista dei film visti
			// Aggiunge poi 4 nuovi film da votare
			storeManager.store.films[theRandomFilm.filmID].nextUp = false;
			storeManager.store.films[theRandomFilm.filmID].seen = true;
			storeManager.store.nextUp = null;

			handlers[ACTIONS.CHOOSE_RANDOM_SET]();

			storeManager.saveStore();
		}, 1000 * 60 * 30 /* = 10 minuti */);
	},

	[ACTIONS.GET_NEXTUP]: () => {
		return { nextUp: storeManager.store.nextUp || null };
		logger.silly('[GET_NEXTUP] Got next film');
	},

	[ACTIONS.VOTEFILM]: ({ filmID, userID }) => {
		if (!storeManager.store.votableFilms.length) {
			logger.silly('[VOTEFILM] err: no poll open');
			return { error: 'no poll open' };
		}
		else if (!storeManager.store.users[userID]) {
			logger.silly('[VOTEFILM] err: invalid user');
			return { error: 'invalid user' };
		}
		else if(storeManager.store.films[filmID].votedBy.indexOf(userID) >= 0){
			logger.silly('[VOTEFILM] err: already voted');
			return { error: 'already voted' };
		}
		else {
			storeManager.store.films[filmID].votedBy.push(userID);
			storeManager.saveStore();
			logger.info('[VOTEFILM] Voted film (' + filmID + ') from ' + userID);
		}
	},

	[ACTIONS.UNVOTEFILM]: ({ filmID, userID }) => {
		if (!storeManager.store.votableFilms.length) {
			logger.silly('[UNVOTEFILM] err: no poll open');
			return { error: 'no poll open' };
		}
		else if (!storeManager.store.users[userID]) {
			logger.silly('[UNVOTEFILM] err: invalid user');
			return { error: 'invalid user' };
		}
		else if(storeManager.store.films[filmID].votedBy.indexOf(userID) < 0){
			logger.silly('[UNVOTEFILM] err: already unvoted');
			return { error: 'already unvoted' };
		}
		else {
			var rObj = storeManager.store.films[filmID];
			rObj.votedBy = rObj.votedBy.filter(item => item !== userID);
			storeManager.saveStore();
			logger.info('[UNVOTEFILM] Unvoted film(' + filmID + ') from ' + userID);
		}
	},

	[ACTIONS.GETFILMVOTED]: ({ userID }) => {
		if (!storeManager.store.users[userID]) {
			logger.silly('[GETFILMVOTED] err: invalid user');
			return { error: 'invalid user' };
		}
		else {
			var InObj = Object.values(storeManager.store.films).filter(film => film.votingOpen);
			var RetObj = {};
			InObj.map(function (film){
				var bool = film.votedBy.indexOf(userID);
				if (bool >= 0){
					RetObj[film.id] = true;
				}
				else {
					RetObj[film.id] = false;
				}
			})
			logger.silly('[GETFILMVOTED] Got list of voted films');
			return RetObj;
		}
	}
}

router.post('/', (req, res) => {
	let handler = handlers[req.body.action];

	if (handler) {
		let result = handler(req.body);
		/*logger.info('[' + req.body.action + ']');*/
		res.json(result);
	}
	else {
		res.sendStatus(500);
		logger.warn('No handler for "' + req.body.action + '"');
		throw 'No handler for "' + req.body.action + '"';
	}
});


// Non credo servano più questi
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
