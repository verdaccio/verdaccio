---
id: use-cases
title: "Casi di utilizzo"
---
## Using private packages

È possibile aggiungere utenti e gestire quali utenti possono accedere a quali pacchetti.

È raccomandabile definire un prefisso per i pacchetti privati, per esempio "locale", così che tutti gli elementi privati abbiano questo aspetto: `local-foo`. In questo modo si possono separare chiaramente i pacchetti pubblici da quelli privati.

## Utilizzo dei pacchetti pubblici da npmjs.org

Se qualche pacchetto non esiste nell'archivio, il server proverà a recuperarlo da npmjs.org. Se npmjs.org non funziona, fornirà solo i pacchetti presenti nella cache come se non ne esistessero altri. Verdaccio scaricherà solo ciò che è necessario (= richiesto dai client), e questa informazione verrà memorizzata, così che se il client chiederà la stessa cosa una seconda volta, potrà essere soddisfatto senza dover chiedere a npmjs.org.

Esempio: se si fa una richiesta express@3.0.1 che va a buon fine da questo server una volta, sarà possibile farla un'altra volta ( con tutte le sue dipendenze) in ogni momento, anche con npmjs.org non funzionante. Però diciamo che express@3.0.0 non verrà scaricato fino a che non sia effettivamente necessario per qualcuno. E se npmjs.org fosse offline, questo server direbbe che solo express@3.0.1 (= solo quello che è nella cache) verrebbe pubblicato, ma nient'altro.

## Annullare pacchetti pubblici

If you want to use a modified version of some public package `foo`, you can just publish it to your local server, so when your type `npm install foo`, it'll consider installing your version.

There's two options here:

1. You want to create a separate fork and stop synchronizing with public version.
    
    If you want to do that, you should modify your configuration file so verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to *config.yaml* and remove `npmjs` from `proxy` list and restart the server.
    
    When you publish your package locally, you should probably start with version string higher than existing one, so it won't conflict with existing package in the cache.

2. You want to temporarily use your version, but return to public one as soon as it's updated.
    
    In order to avoid version conflicts, you should use a custom pre-release suffix of the next patch version. For example, if a public package has version 0.1.2, you can upload 0.1.3-my-temp-fix. This way your package will be used until its original maintainer updates his public package to 0.1.3.