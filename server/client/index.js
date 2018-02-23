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
		}
	}
})

var i = Math.floor((Math.random() * 8) + 1);
function change_image(){
	if(i==8) {
		i=1;
	}
	var img="./photos/w"+i+'.jpg'
	document.getElementById("img1").background=img;
	i++;
	setTimeout(change_image, 50000);
}

change_image();