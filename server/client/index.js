const app = new Vue({
	el: '#app',
	data: {
		films: {},
		username: '',
		nextUp: null,
	},
	created() {
		this.getJSONFilms();
		this.getNextUp();
		
		this.username = localStorage.getItem('maquindi-films-username');
	},
	methods: {
		async getJSONFilms() {
			let res = await axios.post('/api', { action: ACTIONS.GET_FILMS });
			this.films = res.data;
		},
		async getNextUp() {
			let res = await axios.post('/api', { action: ACTIONS.GET_NEXTUP });
			this.nextUp = res.data.nextUp;
		},
		async isAdmin() {
			let res = await axios.post('/api', { action: ACTIONS.ISADMIN, userID: this.username });
			return res.data;
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
		isADM () {
			let res = this.isAdmin().then(function(ret){
				console.log(ret);
				return ret;
			});
		}
	}
});
