var i = Math.floor((Math.random() * 8) + 1);
function change_image(){
	if(i==9) {
		i=1;
	}
	var img="./photos/w"+i+'@small.jpg'
	document.getElementById("img1").background=img;
	i++;
	setTimeout(change_image, 50000);
}

change_image();
