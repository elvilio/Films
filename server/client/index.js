const app = new Vue({
	el: '#app',
	data: {
		films: {},
		username: '',
		nextUp: null,
		isadm: false,
	},
	created() {
		this.getJSONFilms();
		this.getNextUp();
		
		this.username = localStorage.getItem('maquindi-films-username');

		this.isAdmin();
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
			if(this.username != '') {
				let res = await axios.post('/api', { action: ACTIONS.ISADMIN, userID: this.username });
				this.isadm = res.data;
			}
			else {
				this.isadm = false;
			}
		},
		async newPoll(){
			await axios.post('/api', { action: ACTIONS.CHOOSE_RANDOM_SET });
			location.replace('/');
		},
		async closePoll() {
			await axios.post('/api', { action: ACTIONS.CLOSE_POLL });
			location.replace('/');
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
	}
});
