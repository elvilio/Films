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
			let res = await axios.post('/api', { action: ACTIONS.GET_FILMS });
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
		sortedFilmsToVote () {
			return this.sortedFilms.filter(film => film.votingOpen);
		},
		sortedFilmsNextUp () {
			return this.sortedFilmsNotSeen.filter(film => film.nextUp);
		},
		async votafilm(film) {
			try {
				; /* to do */
			} catch (e) {
				console.log(e);
			}
		},
		async unvotafilm(film) {
			try {
				; /* to do */
			} catch (e) {
				console.log(e);
			}
		},
	}
});
