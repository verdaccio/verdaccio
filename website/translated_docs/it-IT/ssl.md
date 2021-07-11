---
id: ssl
title: "Configurare i Certificati SSL"
---

Follow these instructions to configure an SSL certificate to serve an npm registry over HTTPS.

* Aggiornare la proprietà listen in `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Una volta aggiornata la proprietà listen e provato ad avviare verdaccio di nuovo, chiederà i certificati.

* Generare i certificati

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Modificare il file di configurazione `/Users/user/.config/verdaccio/config.yaml` e aggiungere la parte seguente:
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />In alternativa, se si possiede un certificato con il formato `server.pfx`, si può aggiungere la parte di configurazione seguente: (La passphrase è facoltativa e solo necessaria se il certificato è criptato.)
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

Ulteriori informazioni sugli argomenti `key`, `cert`, `ca`, `pfx` e `passphrase` nella [documentazione Node](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Eseguire `verdaccio` nella linea di comando.

* Aprire il browser e visitare `https://your.domain.com:port/`

Queste istruzioni sono ampiamente valide per OSX e Linux; per Windows i percorsi varieranno, ma i passaggi sono gli stessi.

## Docker

Se si sta utilizzando l'immagine Docker, è necessario impostare la variabile d'ambiente `VERDACCIO_PROTOCOL` in `https`, visto che l'argomento `listen` viene fornito nel [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43) e viene quindi ignorato dal file di configurazione.

Si può anche impostare la variabile d'ambiente `VERDACCIO_PORT` se si sta utilizzando una porta differente da `4873`.