const apph2 = new Vue({

	el:'#apph2',
	data: {
		username: '',
	},

	created() {
		this.username = localStorage.getItem('maquindi-films-username');
	}
})

const app = new Vue({
	el: '#app',
	data: {
		films: [],
		username: '',
	},

	methods: {
		async getJSONfilm() {
			try {
				const {data:{json:{film}}} = await axios.get('http://localhost:8000/api/films');
				return film;
			}
			catch (error) {
				console.log(error);
				return [];
			}
		},

		created() {
			// request from server at /api/films
			this.films = this.getJSONfilm();
			this.username = localStorage.getItem('maquindi-films-username');
		}
	}
})