let i = Math.floor((Math.random() * 8) + 1);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let $img1 = document.querySelector(".img1");
let $img2 = document.querySelector(".img2");

const WAIT_TIME = 5000; // 50000

async function change_image(){
	if(i==32) {
		i=1;
	}

	// await sleep(2500);
	let img = "url(./photos/w"+i+'@small.jpg)'
	$img2.style.backgroundImage=img;
	await sleep(2500);

	$img1.style.opacity = 0.0;
	await sleep(2500);

	i++;
	img="url(./photos/w"+i+'@small.jpg)'
	$img1.style.backgroundImage=img;

	await sleep(2500);
	$img1.style.opacity = 1.0;

	await sleep(WAIT_TIME);
	change_image();
}

// change_image();

/// TESTING

let setImage = ($img, url) => {
	$img.style.backgroundImage = url;
};

let getNextImage = () => {
	return `url(./photos/w${(i++ % 31) + 1}@small.jpg)`;
};

async function change_image_2() {

	// La foto visibile farà la transizione, l'altra no
	$img1.style.transition = 'opacity 4s ease-in-out';
	$img2.style.transition = '';

	// Prepara la nuova immagine in background
	setImage($img2, getNextImage());

	await sleep(WAIT_TIME);

	// L'immagine sullo sfondo diventa subito visibile, mentre l'altra fa una transizione
	$img1.style.opacity = 0.0;
	$img2.style.opacity = 1.0;

	await sleep(4000);

	// Swappa le immagini
	$img2.style.zIndex = -80;
	$img1.style.zIndex = -100;
	$img2.style.zIndex = -90;

	let $tmp = $img1;
	$img1 = $img2;
	$img2 = $tmp;

	change_image_2();

}

// Imposta l'immagine della prima foto da mostrare
setImage($img1, getNextImage());
change_image_2();