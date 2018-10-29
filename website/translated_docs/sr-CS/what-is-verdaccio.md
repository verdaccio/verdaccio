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

Možete koristiti prilagođeni registry za sve svoje projekte bilo ako ga podesite na globalno

    npm set registry http://localhost:4873
    

ili preko command line kao argument `--registry` u npm (malo se razlikuje u odnosu na yarn)

    npm install lodash --registry http://localhost:4873
    

## Private

Svi paketi koje publikujete su podešeni kao privatni i dostupni su samo ako su tako konfigurisani.

## Proxy

Verdaccio kešira sve dependencies na zahtev i tako ubrzava instaliranje na lokalne ili privatne mreže.

## Verdaccio u kratkim crtama

* To je web app bazirana na Node.js
* To je privatni npm registry
* To je lokalni network proxy
* To je aplikacija koja podržava plugine
* Prilično jednostavan za instaliranje i korišćenje
* Nudimo Docker i Kubernetes podršku
* 100% Komparibilan sa yarn, npm i pnpm
* Nakon što je **forkovan** na bazi `sinopia@1.4.0` ostvaruje100% **kompatibilnost unazad**.
* Ime Verdaccio označava **zelenu boja koja se koristila za italijansko freskoslikarstvo kasnog srednjeg veka**.