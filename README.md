# Maquindi Films

## All Api Routes

### GET /users

ok

### (AUTH) GET /user/:id

ok

### GET /films

ok

#### (AUTH) POST /films/add

#### (AUTH) POST /films/vote

### POST /login

### GET /apikeys

ok

## Vendor API End Points

### Search

	`https://api.themoviedb.org/3/search/movie?api_key=${ apikey }&query=${ query }`

### Film Info

	`https://api.themoviedb.org/3/movie/${ id }?api_key=${ apikey }`

### Film Image

	`http://image.tmdb.org/t/p/w${ imageWidth }/${ imagePath }`

	

## TODO

4 pagine html:

	--> FILMS che lista: 4 film da votare, tutti i film che sono da vedere,
	film già visti (colore diverso: verde acceso, verde chiaro, rosso chiaro)

	--> LOGIN PAGE, in cui puoi scegliere il tuo account
	da una lista con un checkbox

	--> NEW FILM, dove puoi aggiungere un film,
	mettendo nome escegliendo da una lista di imdb

	--> MAIN, con un change log e altre informazioni su come contattarci
