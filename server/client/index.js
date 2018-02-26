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
			return Object.values(this.films).sort((a, b) => a.title.localeCompare(b.title));
		}
	}
})