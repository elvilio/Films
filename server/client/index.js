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
		},
	},
	computed: {
		/*
		sortedFilms () {
			return Object.values(this.film).sort((a, b) => a.title.localeCompare(b.title));
		}*/
		sortedFilms () {
			let datafilter = Object.values(this.films).filter(function (obj) {
				return obj.seen === 'False';
			})
			return Object.values(datafilter).sort((a,b) => a.title.localeCompare(b.title));
		},
		sortedFilmsSeen () {
			let datafilter = Object.values(this.films).filter(function (obj) {
				return obj.seen === 'True';
			})
			return Object.values(datafilter).sort((a,b) => a.title.localeCompare(b.title));
		}
	}
})
