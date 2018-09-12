---
id: what-is-verdaccio
title: "Cos'è Verdaccio?"
---
Verdaccio è un **registro proxy npm leggero e privato** scritto in **Node.js**

## Cos'è un registro

* Un repositoro per pacchetti che implementa la **specificazione CommonJS Compliant Package Registry** per la lettura delle informazioni dei pacchetti
* Fornisce un API compatibile con i client npm **(yarn/npm/pnpm)**
* Segue il Versionamento semantico compatibile **(semver)**

    $> verdaccio
    

![registry](/svg/verdaccio_server.gif)

## Utilizzo di Verdaccio

L'uso di verdaccio con qualsiasi gestore del pacchetto di nodi dei client è molto semplice.

![registry](/svg/npm_install.gif)

È possibile utilizzare un registro personalizzato oppure settarlo in generale per tutti i tuoi progetti

    npm set registry http://localhost:4873
    

o da riga di comando come argomento `--registry` in npm (leggermente diverso in yarn)

    npm install lodash --registry http://localhost:4873
    

## Privato

Tutti i pacchetti che pubblichi sono privati e accessibili soltanto in base alla tua configurazione.

## Proxy

Verdaccio memorizza tutte le dipendenze su richiesta e velocizza le installazioni in locale o su reti private.

## Verdaccio in pillole

* È un'applicazione web basata su Node.js
* È un registro npm privato
* È un proxy di rete locale
* È un'applicazione estensibile
* È discretamente facile da installare e da usare
* Offriamo supporto Docker e Kubernetes
* È 100% compatibile con yarn, npm e pnpm
* È un **fork** basato su `sinopia@1.4.0` e 100% **retrocompatible**.
* Il nome Verdaccio viene da **Una tonalità di verde, popolare nell'Italia tardo medievale usata per gli affreschi**.