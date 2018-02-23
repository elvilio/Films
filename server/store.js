
const fs = require('fs');

let store = {}

function loadStore() {
	fs.readFile('./films.store.json', 'utf8', (err, data) => {
		store = JSON.parse(data);
	});
}

function saveStore() {
	fs.writeFile('./films.store.json', JSON.stringify(store, null, '\t'))
}


if (fs.existsSync('./server/films.store.json')) {
	console.log('[Log] Loaded the store from file');
	loadStore();
}
else {
	console.log('[Log] No store found, creating it');

	store = {
		films: {
			/* [Id Film: Film] */
		},
		users: {
			/* [Id User: User] */
		}
	}

	saveStore();
}

module.exports = {
	store,
	saveStore,
};