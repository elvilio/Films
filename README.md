# Maquindi Films

## All Api Routes

- GET /users

- (AUTH) GET /user/:id

- GET /films

- (AUTH) POST /film/add

- (AUTH) POST /film/vote

- (AUTH) POST /film/unvote

- POST /login

- GET /apikeys

## Vendor API End Points

### Search

	`https://api.themoviedb.org/3/search/movie?api_key=${ apikey }&query=${ query }`

### Film Info

	`https://api.themoviedb.org/3/movie/${ id }?api_key=${ apikey }`

### Film Image

	`http://image.tmdb.org/t/p/w${ imageWidth }/${ imagePath }`

	

## TODO

- [x] Da json a lista in html nel mainpage
- [x] login effettivo
- [x] dalla pagina newFilm fare il layout effettivo delle cose e poter aggiungere film
- [x] logout (?)
- [ ] in /addfilm aggiungere il codice per aggiungere i film quando si preme il bottone
- [ ] nella home aggiungere il modo di votare i film se l'utente è loggato
- [ ] aggiungere tutti i film in films.txt
	- [ ] scrivere uno script o qlcs del genere per fare ciò
