---
id: šta-je-verdaccio
title: "Šta je Verdaccio?"
---
Verdaccio je **lightweight private npm proxy registry** ugrađen u **Node.js**

## Šta je registry

* Repozitorijum za pakete koji implementira **CommonJS Compliant Package Registry specification** za čitanje informacija o paketu
* Obezbeđuje API kompatibilnost sa npm klijentima, **(yarn/npm/pnpm)**
* Prati semantiku Versioning compatible **(semver)**

    $> verdaccio
    

![registry](/svg/verdaccio_server.gif)

## Korišćenje Verdaccio-a

Korišćenje verdaccio-a sa bilo kojim node package manager client je vrlo jasno određeno.

![registry](/svg/npm_install.gif)

You can use a custom registry either setting globally for all your projects

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