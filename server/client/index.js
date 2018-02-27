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
		async getJSONFilms() {
			let res = await axios.get('/api/films');
			this.films = res.data;
		}
	},
	computed: {
		sortedFilms () {
			let pippo = this.films
			return Object.values(pippo).sort((a, b) => a.title.localeCompare(b.title));
		}
	}
})