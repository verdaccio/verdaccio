---
id: puppet
title: "Puppet"
---
Installazione di verdaccio per Debian, Ubuntu, Fedora, and RedHat.

# Utilizzo

Sono disponibili due varianti per installare verdaccio usando questo modulo Puppet:

* Metodo Apply (con puppet-apply e senza la necessità di configurare il puppet master)
* Metodo Master- Agent (con l'accesso del puppet-agent alla configurazione tramite il puppet master).

In both variants you have to explicitely call "class nodejs {}" in your puppet script because the puppet-verdaccio module only defines this as a requirement, so you have all the flexibility you want when installing nodejs. Scroll down for details about Master-Agent-mode variant.

For further information:

<https://github.com/verdaccio/puppet-verdaccio>

> We are looking for active contributors for this integration, if you are interested [refers to this ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).