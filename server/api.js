
const R = require('ramda');

const express = require('express');
const router = express.Router();

const storeManager = require('./store.js');

router.get('/users', (req, res) => {

	let users = storeManager.store.users;
	let reducedUsers = R.pipe(
		R.values,
		R.map(it => R.pick(['id', 'name'], it))
	)(users);

	res.json(reducedUsers);
	
});

module.exports = router;