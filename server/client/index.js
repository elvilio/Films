const app = new Vue({
	
	el: '#app',
	data: {
		films: [],
		username: '',
	},

	created() {
		// request from server at /api/films
		const mock = {
			"tt2543164": {
				"id": "tt2543164",
				"addedBy": "aziis98",
			},
		}

		this.username = localStorage.getItem('maquindi-films-username');
	}
})

const apph2 = new Vue({

	el:'#apph2',
	data: {
		username: '',
	},

	created() {
		this.username = localStorage.getItem('maquindi-films-username');
	}
})