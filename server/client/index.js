const app = new Vue({
	
	el: '#app',
	data: {
		films: [],
	},

	created() {
		// request from server at /api/films
		const mock = {
			"tt2543164": {
				"id": "tt2543164",
				"addedBy": "aziis98",
			},
		},

		// SEARCH FILMS --- https://api.themoviedb.org/3/search/movie?api_key=69b06297ce405f96197256a6beee287f&query=Arrival

		// IMAGES --- http://image.tmdb.org/t/p/w300/hLudzvGfpi6JlwUnsNhXwKKg4j.jpg
	}
})