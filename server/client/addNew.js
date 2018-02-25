const app = new Vue({
	
	el: '#app',
	data: {
		films: [],
		username: '',
	},

	created() {
		this.username = localStorage.getItem('maquindi-films-username');
	},
});
