---
id: ssl
title: "Configurare i Certificati SSL"
---
Segui queste istruzioni per configurare un certificato SSL che serva al registro NPM sotto HTTPS.

* Aggiornare la proprietà listen in `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Una volta aggiornato listen e avviato verdaccio di nuovo chiederà i certificati.

* Generare i certificati

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Edit your config file `/Users/user/.config/verdaccio/config.yaml` and add the following section
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />In alternativa, se si possiede un certificato di formato `server.pfx`, si può aggiungere la seguente configurazione. La passphrase è facoltativa e solo necessaria se il certificato è criptato.
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

Ulteriori informazioni sugli argomenti `key`, `cert`, `ca`, `pfx` e `passphrase` sulla [documentazione Node ](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Eseguire `verdaccio` nella linea di comando.

* Aprire il browser e caricare `https://your.domain.com:port/`

Le istruzioni sono ampiamente valide per OSX e Linux, per Windows i percorsi potranno variare, ma i passi da seguire sono gli stessi.

## Docker

Se si sta utilizzando l'immagine Docker, bisogna impostare la variabile ambientale `PROTOCOL` su `https` visto che l'argomento `listen` viene fornito su [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43), e viene quindi ignorato dal file di configurazione.

Si può anche impostare la variabile ambientale `PORT` se si sta utilizzando una porta differente da `4873`.