---
id: шта-је-verdaccio
title: "Шта је Verdaccio?"
---

Verdaccio је **lightweight private npm proxy registry** уграђен у **Node.js** <iframe width="560" height="315" src="https://www.youtube.com/embed/hDIFKzmoCaA?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe> 

## What's a registry?

* A registry is a repository for packages, that implements the **CommonJS Compliant Package Registry specification** for reading package's information.
* Provide a compatible API with npm clients **(yarn/npm/pnpm)**.
* Semantic Versioning compatible **(semver)**.

    $> verdaccio
    

![registry](assets/verdaccio_server.gif)

## Коришћење Verdaccio-а

Using Verdaccio with any Node.js package manager client is quite straightforward.

![registry](assets/npm_install.gif)

You can use a custom registry either by setting it globally for all your projects

    npm set registry http://localhost:4873
    

or by using it in command line as an argument `--registry` in npm (slightly different in yarn)

    npm install lodash --registry http://localhost:4873
    

    yarn config set registry http://localhost:4873
    

## Private

Сви пакети које публикујете су подешени као приватни и доступни су само ако су тако конфигурисани.

## Proxy

Verdaccio cache all dependencies on demand and speed up installations in local or private networks.

## In a Nutshell

* То је web app базирана на Node.js
* То је приватни npm registry
* То је локални network proxy
* То је апликација која подржава плугине
* It's fairly easy to install and to use
* Нудимо Docker и Kubernetes подршку
* 100% Компатибилан са yarn, npm и pnpm
* Verdaccio means **A green color popular in late medieval Italy for fresco painting**.