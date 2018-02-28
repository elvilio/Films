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
		/*
		sortedFilms () {
			return Object.values(this.films).sort((a, b) => a.title.localeCompare(b.title));
		}*/
		sortedFilms () {
			let datafilter = Object.values(this.films).filter(function (obj) {
				console.log(obj.seen);
				return obj.seen !== 'True';
			})
			return datafilter.sort((a,b) => a.title.localeCompare(b.title));
		},
		sortedFilmsSeen () {
			let datafilter = Object.values(this.films).filter(function (obj) {
				return obj.seen === 'True';
			})
			let a =  datafilter.sort((a,b) => a.title.localeCompare(b.title));
			return a;
		}
	}
});
