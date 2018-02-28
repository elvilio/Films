
const ACTIONS = {
	FILMS: 'FILMS',
	USERS: 'USERS',
	ADD_FILM: 'ADD_FILM',
}

try {
	if (window) {
		console.log('[Device] Found Browser!');
	}
}
catch (e) {
	console.log('[Device] Found NodeJS!');
	module.exports = ACTIONS;
}