---
id: puppet
title: "Puppet"
---
Installazione di verdaccio per Debian, Ubuntu, Fedora, and RedHat.

# Utilizzo

Sono disponibili due varianti per installare verdaccio usando questo modulo Puppet:

* Metodo Apply (con puppet-apply e senza la necessità di configurare il puppet master)
* Metodo Master-Agent (con accesso alla configurazione del puppet-agent tramite il puppet master).

In entrambe le varianti è necessario chiamare esplicitamente i "class nodejs {}" nel puppet script perché il modulo puppet-verdaccio lo definisce solo come un requisito, per cui si ha tutta la flessibilità che si desidera al momento di installare nodejs. Scorrere verso il basso per dettagli sulla variante del metodo Master-Agent.

Per ulteriori informazioni:

<https://github.com/verdaccio/puppet-verdaccio>

> Stiamo cercando collaboratori attivi per questa integrazione, se sei interessato [ fai riferimento a questo ticket](https://github.com/verdaccio/puppet-verdaccio/issues/11).