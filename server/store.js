const fs = require('fs');
const logger = require('./index.js');

let store = {}

function loadStore(cb) {
	let data = fs.readFileSync('./films.store.json', 'utf8');
	store = JSON.parse(data);
	logger.silly('[Log] Loaded the store from file');
}

function saveStore() {
	fs.writeFile('./films.store.json', JSON.stringify(store, null, '\t'), (err) => {
		if (err) throw err;
	})
	logger.silly('[Log] Saved the store to file');
}


if (fs.existsSync('./films.store.json')) {
	loadStore();
}
else {
	logger.error('[Log] No store found, creating it');

	store = {
		films: {
			/* [Id Film: Film] */
		},
		users: {
			/* [Id User: User] */
		},
	}

	saveStore();
}

module.exports = {
	store,
	saveStore,
};
