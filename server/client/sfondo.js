function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let $img1 = document.querySelector(".img1");
let $img2 = document.querySelector(".img2");

const WAIT_TIME = 5000; // 50000

let setImage = ($img, url) => {
	$img.style.backgroundImage = url;
};

let getNextImage = () => {
	return `url(./photos/w${(Math.floor((Math.random() * 31) + 1))}@small.jpg)`;
};

async function change_image_2() {

	setImage($img2, getNextImage());

	await sleep(WAIT_TIME);

	$img1.style.opacity = 0.0;

	await sleep(4000);

	setImage($img1, getNextImage());

	await sleep(WAIT_TIME);

	$img1.style.opacity = 1.0;

	await sleep(4000);

	change_image_2();
}

// Imposta l'immagine della prima foto da mostrare
setImage($img1, getNextImage());
change_image_2();