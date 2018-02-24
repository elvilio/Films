var i = Math.floor((Math.random() * 8) + 1);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function change_image(){
	if(i==32) {
		i=1;
	}

	await sleep(2500);
	var img="url(./photos/w"+i+'.jpg)'
	document.querySelector(".img2").style.backgroundImage=img;
	await sleep(2500);

	document.querySelector(".img1").style.opacity=0;
	await sleep(2500);

	i++;
	img="url(./photos/w"+i+'.jpg)'
	document.querySelector(".img1").style.backgroundImage=img;

	await sleep(2500);
	document.querySelector(".img1").style.opacity=100;

	await sleep(50000);
	change_image();
}

change_image();
