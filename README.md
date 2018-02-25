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

- [ ] Da json a lista in html nel mainpage
- [ ] login effettivo
- [ ] dalla pagina newFilm fare il layout effettivo delle cose e poter aggiungere film
- [ ] logout (?)
