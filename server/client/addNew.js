const app = new Vue({
	
	el: '#app',
	data: {
		films: [],
		username: '',
		search: '',
		tmdbResults: [], 
	},

	created() {
		this.username = localStorage.getItem('maquindi-films-username');
		this.getAPIKeys();
	},

	methods: {
		async getAPIKeys() {
			this.apikeys = (await axios.get('/api/apikey')).data;
		},
		async searchFilm() {
			let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${ this.apikeys.tmdb }&query=${ this.search.trim() }`);
			this.tmdbResults = res.data.results;
		},
		async aggiungi_film(film) {
			// TODO
		},
	}
});
