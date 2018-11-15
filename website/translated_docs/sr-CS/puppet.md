---
id: puppet
title: "Puppet"
---
Instalacija verdaccio-a za Debian, Ubuntu, Fedora, i RedHat.

# Korišćenje

Postoje dva načina za instaliranje verdaccio-a korišćenjem Puppet modula:

* Apply-mode (sa puppet-apply i bez da je puppetmaster setup neophodan)
* Master-Agent-mode (sa puppet-agent pristupa Vašoj konfiguraciji preko puppetmaster).

U oba slučaja morate eksplicitno pozvati "class nodejs {}" u svom puppet script jer puppet-verdaccio module jedino to definiše kao neophodno, tako da možete biti fleksibilni kada instalirate nodejs. Skrolujte na dole za više detalja o Master-Agent-mode varijanti.

Za dalje informacije:

<https://github.com/verdaccio/puppet-verdaccio>

> Tražimo aktivne saradnike za ovu integraciju, pa ako ste zainteresovani, [pošaljite nam ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).