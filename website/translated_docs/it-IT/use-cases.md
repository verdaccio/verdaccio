---
id: use-cases
title: "Casi di utilizzo"
---
## Utilizzo di pacchetti privati

È possibile aggiungere utenti e gestire quali utenti possono accedere a quali pacchetti.

È raccomandabile definire un prefisso per i pacchetti privati, per esempio "locale", così che tutti gli elementi privati abbiano questo aspetto: `local-foo`. In questo modo si possono separare chiaramente i pacchetti pubblici da quelli privati.

## Utilizzo dei pacchetti pubblici da npmjs.org

Se qualche pacchetto non esiste nell'archivio, il server proverà a recuperarlo da npmjs.org. Se npmjs.org non funziona, fornirà solo i pacchetti presenti nella cache come se non ne esistessero altri. Verdaccio scaricherà solo ciò che è necessario (= richiesto dai client), e questa informazione verrà memorizzata nella cache, così che se il client chiederà la stessa cosa una seconda volta, potrà essere soddisfatto senza dover chiedere a npmjs.org.

Esempio: se si fa una richiesta express@3.0.1 che va a buon fine da questo server una volta, sarà possibile farla un'altra volta ( con tutte le sue dipendenze) in ogni momento, anche con npmjs.org non funzionante. Però diciamo che express@3.0.0 non verrà scaricato fino a che non sia effettivamente necessario per qualcuno. E se npmjs.org fosse offline, questo server direbbe che solo express@3.0.1 (= solo quello che è nella cache) verrebbe pubblicato, ma nient'altro.

## Annullare pacchetti pubblici

Se si desidera utilizzare una versione modificata di qualche pacchetto pubblico `foo`, si può pubblicarla solamente sul server locale, così scrivendo `npm install foo`, installerà questa versione.

Ci sono due opzioni qui:

1. Si desidera creare un fork separato e interrompere la sincronizzazione con la versione pubblica.
    
    Se si vuole fare ciò, si dovrebbe modificare il file di configurazione affinché verdaccio non faccia più richieste a npmjs riguardo a questi pacchetti. Aggiungere un'entrata separata per questo pacchetto a *config.yaml* e rimuovere `npmjs` dalla lista `proxy` e riavviare il server.
    
    Quando si pubblica il pacchetto in locale, si dovrebbe probabilmente iniziare con formato della stringa superiore a quella esistente, così che non vada in conflitto con il pacchetto già esistente nella cache.

2. Si vuole temporaneamente utilizzare la propria versione, ma tornare alla pubblica appena questa sia aggiorna,.
    
    Per evitare qualsiasi conflitto delle versioni, si dovrebbe usare un suffisso personalizzato rilasciato prima della successiva versione della patch. Per esempio, se un pacchetto pubblico ha la versione 0.1.2, si può caricare 0.1.3-my-temp-fix. In questo modo il pacchetto verrà utilizzato fino a che il suo manutentore originale aggiorni il suo pacchetto pubblico alla 0.1.3.