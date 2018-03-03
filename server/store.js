const fs = require('fs');

let store = {}

function loadStore(cb) {
	let data = fs.readFileSync('./films.store.json', 'utf8');
	store = JSON.parse(data);
}

function saveStore() {
	fs.writeFile('./films.store.json', JSON.stringify(store, null, '\t'), (err) => {
		if (err) throw err;
	})
}


if (fs.existsSync('./films.store.json')) {
	loadStore();
	console.log('[Log] Loaded the store from file');
}
else {
	console.log('[Log] No store found, creating it');

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
