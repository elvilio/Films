const app = new Vue({
	el: '#app',
	data: {
		films: [],
		username: '',
	},
	created() {
		// request from server at /api/films
		this.getJSONFilms();
		this.username = localStorage.getItem('maquindi-films-username');
	},
	methods: {
		getJSONFilms() {
			axios.get('/api/films')
				.then(res => {
					this.films = res.data;
				})
				.catch(err => {
					throw err;	
				});
		}
	}
})