const app = new Vue({
	
	el: '#app',
	data: {
		films: [],
		username: '',
		fieldUsername: '',
	},

	created() {
		this.username = localStorage.getItem('maquindi-films-username');
	},

	methods: {
		async log_in (event) {
			let username = this.fieldUsername.trim().toLowerCase();

			if (username.length > 0 && username.match(/\w+/)) {
				let res = await axios.get('/api/user/' + username);
				
				if (res.data === 'user not found') {
					console.log('User not found!');
				}
				else {
					localStorage.setItem('maquindi-films-username', username);
					console.log('Logged in as "%s"', username);
					location.replace('/');
				}
			}
		},
		async log_out(e) {
			this.username = ''; 
			localStorage.setItem('maquindi-films-username', '');
		},
	}
})

