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

Tutto il testo dopo il carattere # è da considerarsi un commento

	type Metro = Double # Alias per indicare i metri

## Struttura del database

	type Id T = String
	type Map T = { Id T : T }

	type Film = {
		id: Id Item
		type: String = 'film'

		addedBy: Id User
		addedOn: String
		
		# Magari passare ad una sola variabile tipo "state"?
		seen: Boolean
		votingOpen: Boolean
		nextUp: Boolean
		
		votedBy: [ Id User ]
		
		movieId: Id Film
		title: String
		image: String
	}

	type User = {
		id: Id User
		name: String
	}

	type Root = {
		items: Map Film
		users: Map User
		
		watchedFilms: [Id Film] # Forse?
		votableFilms: [Id Film]
		nextUp: Id Film
	}

## Future

Eventuali cambiamenti da aggiungere in futuro
	
	type Saga = {
		id: Id Item
		type: String = 'saga'
		
		addedBy: Id User
		addedOn: String
		
		seen: Boolean
		nextToWatch: Int
		votingOpen: Boolean
		nextUp: Boolean

		votedBy: { Id User : Boolean = true }

		films: [Film]
	}

	type Item = Film | Saga