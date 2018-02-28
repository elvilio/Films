
const ACTIONS = {
	GET_FILMS: 'FILMS',
	GET_USERS: 'USERS',
	ADD_FILM: 'ADD_FILM',
	GET_APIKEYS: 'GET_APIKEYS',
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