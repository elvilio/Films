# Schema del JSON del "Database"

**DISCLAIMER:** Non perdete troppo tempo a capire il motivo di esistenza di questo file, serve principalmente a me per non implodere.

In questo file viene descritta l'eventuale struttura del JSON che contiene tutti i dati

## Per capire la sintassi

Questa sintassi è puramente inventata e non serve a niente di concreto oltre che ad organizzare un po' le cose.

La definizione di un tipo è fatta così

	type Cosa = {
		nomeProprietà: Tipo
	}

Un array di tipo A è indicato

	[A]

Un dizionario di chiavi-valori è indicato

	{ TipoChiave : TipoValore }


## Struttura del database

	type Id T = String
	type Map T = { Id T : T }

	type Saga = {
		id: Id Item
		type: String = 'saga'
		
		addedBy: Id User
		addedOn: String
		watched: Boolean

		films: [Film]
	}

	type Film = {
		id: Id Item
		type: String = 'film'

		addedBy: Id User
		addedOn: String
		watched: Boolean

		movieId: Id Film
		title: String
		image: String
	}

	type Item = Film | Saga

	type User = {
		id: Id User
		name: String
		votedFilms: [Id Film]
	}

	type Root = {
		items: Map Item
		users: Map User
		
		watchedFilms: [Id Film]
	}