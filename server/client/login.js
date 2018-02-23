const app = new Vue({
	
	el: '#login',
	data: {
		films: [],
		username: "",
	},

	created() {
		// request from server at /api/films
		const mock = {
			"tt2543164": {
				"id": "tt2543164",
				"addedBy": "aziis98",
			},
		}
	},

	methods: {
		log_in: function (event) {
			localStorage.setItem('maquindi-films-username', this.username);
			console.log('fglsnhgfd');
		},
	}
})

