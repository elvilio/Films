
const ACTIONS = {
	GET_FILMS: 'GET_FILMS',
	ADD_FILM: 'ADD_FILM',
	
	GET_USERS: 'GET_USERS',
	GET_USER: 'GET_USER',
	
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