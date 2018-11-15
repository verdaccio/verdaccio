---
id: ssl
title: "Podešavanje SSL Sertifikata"
---
Pratite instrukcije kako da konfigurišete SSL sertifikat koji služi u NPM registriju pod HTTPS.

* Ažurirajte svojstvo listen u svom `~/.config/verdaccio/config.yaml`:

    listen: 'https://your.domain.com/'
    

Jednom kada ažurite listen i probate ponovo da pokrenete verdaccio, pitaće Vas za sertifikate.

* Generišite svoje sertifikate

     $ openssl genrsa -out /Users/user/.config/verdaccio/verdaccio-key.pem 2048
     $ openssl req -new -sha256 -key /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-csr.pem
     $ openssl x509 -req -in /Users/user/.config/verdaccio/verdaccio-csr.pem -signkey /Users/user/.config/verdaccio/verdaccio-key.pem -out /Users/user/.config/verdaccio/verdaccio-cert.pem
     ````
    
    * Edit your config file `/Users/user/.config/verdaccio/config.yaml` and add the following section
    
    

https: key: /Users/user/.config/verdaccio/verdaccio-key.pem cert: /Users/user/.config/verdaccio/verdaccio-cert.pem ca: /Users/user/.config/verdaccio/verdaccio-csr.pem

    <br />Alternativno, ako imate sertifikat u `server.pfx` formatu, možete dodati sledeću sekciju za konfigurisanje. Ako je Vaš sertifikat enkriptovan, jedino je neophodno uneti passphrase.
    
    

https: pfx: /Users/user/.config/verdaccio/server.pfx passphrase: 'secret' ````

Više informacija o `key`, `cert`, `ca`, `pfx` i `passphrase` argumentima u [Node dokumentaciji](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options)

* Pokrenite `verdaccio`u svom command line-u.

* Otvorite pretraživač i učitajte `https://your.domain.com:port/`

Instrukcije važe uglavnom za OSX i Linux, dok će na Windows-u putanje (paths) biti različite, ali u suštini, koraci su isti.

## Docker

Ako koristite Docker image, potrebno je da podesite `PROTOCOL` environment varijablu na `https` pošto je `listen` argument obezbeđen kao [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43), i stoga ignorisan od strane config fajla.

Takođe možete da podesite `PORT` environment variablu ako koristite različit port od `4873`.