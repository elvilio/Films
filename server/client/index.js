const app = new Vue({
	el: '#app',
	data: {
		films: {},
		username: '',
		nextUp: null,
		isadm: false,
		switchVoting: [],
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
			this.getJSONFilms();
			this.getNextUp();
		},
		async closePoll() {
			await axios.post('/api', { action: ACTIONS.CLOSE_POLL });
			this.getJSONFilms();
			this.getNextUp();
		},
		async votafilm(film) {
			await axios.post('/api', {
				action: ACTIONS.VOTEFILM,
				filmID: film.id,
				userID: this.username
			});
			// Ok, questo si può ottimizzare
			this.getJSONFilms();
		},
		async unvotafilm(film) {
			await axios.post('/api', {
				action: ACTIONS.UNVOTEFILM,
				filmID: film.id,
				userID: this.username
			});
			// Ok, questo si può ottimizzare
			this.getJSONFilms();
		},
		async getfilm_imdb (film) {
			let variable = await axios.post('/api', {
				action: ACTIONS.GETFILM_IMDB,
				filmID: film.id,
			});
			return variable;
		}
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
		votedFilms () {
			return this.sortedFilmsToVote.filter(film => film.votedBy.includes(this.username)).map(film => film.id)
		}
	}
});
