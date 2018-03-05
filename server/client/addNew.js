const app = new Vue({
	
	el: '#app',
	data: {
		films: {},
		username: localStorage.getItem('maquindi-films-username'),
		search: '',
		tmdbResults: [], 
	},

	async created() {
		this.getFilms();
		this.getAPIKeys();
	},

	methods: {
		async getAPIKeys() {
			let res = await axios.post('/api', { action: ACTIONS.GET_APIKEYS });
			this.apikeys = res.data;
		},
		async searchFilm() {
			let res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${ this.apikeys.tmdb }&language=it-IT&query=${ this.search.trim() }`);
			this.tmdbResults = res.data.results.map(
				({ id, original_title, title, overview, poster_path, release_date }) => ({ id, title, original_title, overview, poster_path, release_date, added: this.films[id] })
			);
		},
		async aggiungi_film(film) {
			try {
				// TODO: Fixare qua
				await axios.post('/api', {
					action: ACTIONS.ADD_FILM,
					filmID: film.id,
					userID: this.username,
				});
				film.added = true;
				this.getFilms();
			} catch (e) {
				console.log(e);
			}
		},
		async getFilms() {
			this.films = (await axios.post('/api', { action: ACTIONS.GET_FILMS })).data;
		}
	}
});
