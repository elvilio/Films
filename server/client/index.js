const app = new Vue({
	el: '#app',
	data: {
		films: [],
		username: '',
	},
	created() {
		this.getJSONFilms();
		
		this.username = localStorage.getItem('maquindi-films-username');
	},
	methods: {
		async getJSONFilms() {
			let res = await axios.post('/api', { action: ACTIONS.FILMS });
			this.films = res.data;
		},
	},
	computed: {
		sortedFilms () {
			return Object.values(this.films).sort((a, b) => a.title.localeCompare(b.title));
		},
		sortedFilmsSeen () {
			return this.sortedFilms.filter(film => film.seen);
		},
		sortedFilmsNotSeen () {
			return this.sortedFilms.filter(film => !film.seen);
		},
	}
});
