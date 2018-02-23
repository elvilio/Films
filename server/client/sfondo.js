var i = Math.floor((Math.random() * 8) + 1);
function change_image(){
	if(i==9) {
		i=1;
	}
	var img="url(./photos/w"+i+'@small.jpg)'
	document.querySelector(".img1").style.backgroundImage=img;
	i++;
	setTimeout(change_image, 50000);
}

change_image();
