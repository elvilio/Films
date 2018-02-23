# Maquindi Films

## All Api Routes

### GET /users

ok

### (AUTH) GET /user/:id

ok

### GET /films

ok

#### (AUTH) POST /films/add

ok

#### (AUTH) POST /films/vote

ok

### POST /login

ehm...

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

- [ ] Da json a lista in html nel mainpage
- [ ] login effettivo
- [ ] dalla pagina newFilm fare il layout effettivo delle cose e poter aggiungere film
- [ ] logout (?)
