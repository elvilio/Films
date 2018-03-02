## Da Implementare:

- [x] Funzione che prenda 4 film a random dalla lista dei film non ancora visti, e gli assegna nel json votingOpen True (saranno poi fatti vedere nel main con la possibilità di votarli).

	> Per ora, per provare a mano base andare a `/api/random-films`, altrimenti usare `ACTIONS.CHOOSE_RANDOM_SET` dal codice.

- [ ] Funzione che chiude le votazioni sui 4 film, vede quello con maggior numero di voti e farlo ritornare (se due o più sono pari vedere gli utenti e calcolare il numero di voti medio e scegliere quello con meno voti in media, e se due o più di nuovo sono pari, scegliere a random) (per ora scegli a random direttamente)
	- [ ] forse sarebbe meglio se il film scelto stia per 10~ minuti come in prossimo o roba del genere in modo da visualizzarlo sul main e poi automaticamente rimetterlo non in vista
	- [ ] dei 4 film ai 3 non ancora da vedere bisogna azzerare i voti e quindi azzerare anche i voti agli utenti

## Domande:

- [x] Serve veramente il parametro `votedFilms` degli utenti? (Non viene mai usato dal client quindi si potrebbe togliere) -----> **_Io direi di no ma di fare un log sul server che ti dica chi ha votato cosa e quando che in caso andasse giù per qualsiasi motivo o si corrompesse il file abbiamo un backup_**