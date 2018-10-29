---
id: ssl
title: "Podešavanje SSL Sertifikata"
---
Pratite instrukcije kako da konfigurišete SSL certifikat koji služi u NPM registriju pod HTTPS.

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

This instructions are mostly valid under OSX and Linux, on Windows the paths will vary but, the steps are the same.

## Docker

If you are using the Docker image, you have to set the `PROTOCOL` environment variable to `https` as the `listen` argument is provided on the [Dockerfile](https://github.com/verdaccio/verdaccio/blob/master/Dockerfile#L43), and thus ignored from your config file.

You can also set the `PORT` environment variable if you are using a different port than `4873`.