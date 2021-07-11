---
id: ki-ni-verdaccio
title: "Ki ni verdaccio?"
---

Verdaccio jẹ **ibi iforukọsilẹ aṣoju ikọkọ npm aladani fifuyẹ** to jẹ kikọ ni **Node.js** <iframe width="560" height="315" src="https://www.youtube.com/embed/hDIFKzmoCaA?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe> 

## What's a registry?

* A registry is a repository for packages, that implements the **CommonJS Compliant Package Registry specification** for reading package's information.
* Provide a compatible API with npm clients **(yarn/npm/pnpm)**.
* Semantic Versioning compatible **(semver)**.

    $> verdaccio
    

![ibi iforukọsilẹ](assets/verdaccio_server.gif)

## Lilo Verdaccio

Using Verdaccio with any Node.js package manager client is quite straightforward.

![ibi iforukọsilẹ](assets/npm_install.gif)

You can use a custom registry either by setting it globally for all your projects

    npm set registry http://localhost:4873
    

or by using it in command line as an argument `--registry` in npm (slightly different in yarn)

    npm install lodash --registry http://localhost:4873
    

    yarn config set registry http://localhost:4873
    

## Ikọkọ

Gbogbo awọn akopọ ti o ṣe atẹjade rẹ jẹ ikọkọ atipe o se wọle si nikan ni dida lori iṣeto rẹ.

## Aṣoju ikọkọ

Verdaccio cache all dependencies on demand and speed up installations in local or private networks.

## In a Nutshell

* O jẹ ohun elo ayelujara ti o da lori Node.js
* O jẹ ibi iforukọsilẹ npm ti ikọkọ kan
* O jẹ aṣoju ikọkọ nẹtiwọki ibilẹ kan
* O jẹ ohun elo alaasomọ kan
* It's fairly easy to install and to use
* A pese atilẹyin Docker ati Kubernetes
* O ni ibamu 100% pẹlu yarn, npm ati pnpm
* Verdaccio means **A green color popular in late medieval Italy for fresco painting**.