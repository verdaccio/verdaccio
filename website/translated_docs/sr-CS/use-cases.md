---
id: use-cases
title: "Use Cases"
---
## Korišćenje privatnih paketa

Možete dodavati korisnike i određivati koji će korisnici imati pristup kojim paketima.

Zaista se preporučuje da definišete prefiks za svoje privatne pakete, na primer "local". Posle toga, sve što je privatno, izgledaće ovako: `local-foo`. Na ovaj način možete jasno razdvojiti javne pakete od privatnih.

## Korišćenje javnih paketa sa npmjs.org

Ako neki od paketa ne postoji u memoriji, server će pokušati da ga preuzme (fetch) sa npmjs.org. U slučaju da npmjs.org nije u funkciji, preuzeće se iz cache-a. Verdaccio će preuzeti samo ono što je neophodno (= ono što je klijent zatražin), i ta će informacija biti keširana, tako da u slučaju da klijent ponovo prosledi isti zahtev, preuzeće se bez aktivne potrebe za npmjs.org.

Primer: ako ste jednom poslali zahtev za express@3.0.1sa ovog servera, bićete u mogućnosti da to uradite ponovo (sa svim potrebnim dependencies) kad god je npmjs.org van funkcije. But say express@3.0.0 will not be downloaded until it's actually needed by somebody. And if npmjs.org is offline, this server would say that only express@3.0.1 (= only what's in the cache) is published, but nothing else.

## Override public packages

If you want to use a modified version of some public package `foo`, you can just publish it to your local server, so when your type `npm install foo`, it'll consider installing your version.

There's two options here:

1. You want to create a separate fork and stop synchronizing with public version.
    
    If you want to do that, you should modify your configuration file so verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to *config.yaml* and remove `npmjs` from `proxy` list and restart the server.
    
    When you publish your package locally, you should probably start with version string higher than existing one, so it won't conflict with existing package in the cache.

2. You want to temporarily use your version, but return to public one as soon as it's updated.
    
    In order to avoid version conflicts, you should use a custom pre-release suffix of the next patch version. For example, if a public package has version 0.1.2, you can upload 0.1.3-my-temp-fix. This way your package will be used until its original maintainer updates his public package to 0.1.3.