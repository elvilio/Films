const app = new Vue({
	
	el: '#app',
	data: {
		username: '',
		fieldUsername: '',
	},

	created() {
		this.username = localStorage.getItem('maquindi-films-username');
	},

	methods: {
		async loginUser() {
			let username = this.fieldUsername.trim().toLowerCase();

			if (username.length > 0 && username.match(/\w+/)) {
				let res = await axios.post('/api', { action: ACTIONS.GET_USER, userID: username });
				let user = res.data;
				
				if (user.error) {
					console.log('User not found!');
				}
				else {
					localStorage.setItem('maquindi-films-username', username);
					console.log('Logged in as "%s"', username);
					location.replace('/');
				}
			}
		},
		async logoutUser() {
			this.username = ''; 
			localStorage.setItem('maquindi-films-username', '');
		},
	}
})

