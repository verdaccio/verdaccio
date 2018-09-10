---
id: what-is-verdaccio
title: "Cos'è Verdaccio?"
---
Verdaccio è un **registro proxy npm leggero e privato** scritto in **Node.js**

## Cos'è un registro

* Un repository per pacchetti che implementa la **specificazione CommonJS Compliant Package Registry** per la lettura delle informazioni dei pacchetti
* Fornisce un API compatibile con i client npm **(yarn/npm/pnpm)**
* Segue il Versionamento semantico compatibile **(semver)**

    $> verdaccio
    

![registry](/svg/verdaccio_server.gif)

## Utilizzo di Verdaccio

L'uso di verdaccio con qualsiasi gestore del pacchetto di nodi dei client.

![registry](/svg/npm_install.gif)

È possibile utilizzare un registro personalizzato oppure settarlo in generale per tutti i tuoi progetti

    npm set registry http://localhost:4873
    

or by command line as argument `--registry` in npm (slightly different in yarn)

    npm install lodash --registry http://localhost:4873
    

## Private

All packages that you publish are private and only accessible based in your configuration.

## Proxy

Verdaccio cache all dependencies by demand and speed up installations in local or private networks.

## Verdaccio in a nutshell

* It's a web app based on Node.js
* It's a private npm registry
* It's a local network proxy
* It's a Pluggable application
* It's a fairly easy install and use
* We offer Docker and Kubernetes support
* It is 100% compatible with yarn, npm and pnpm
* It was **forked** based on `sinopia@1.4.0` and 100% **backward compatible**.
* Verdaccio means **A green color popular in late medieval Italy for fresco painting**.