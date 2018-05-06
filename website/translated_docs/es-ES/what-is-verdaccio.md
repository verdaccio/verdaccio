---
id: what-is-verdaccio
title: "Qué es Verdaccio?"
---
Verdacio es un **ligero registry privado y proxy**hecho en **Node.js**

## Qué es un registro

* Un repositorio de paquetes que implementan la espcificación **CommonJS Compliant Package Registry specification** para la lectura de información de paquetes
* Provee un API compatible con clientes npm **(yarn/npm/pnpm)**
* Compatible con el versionado semantico **(semver)**

    $> verdaccio
    

![registry](/svg/verdaccio_server.svg)

## Usando Verdaccio

Usar verdaccio con cualquier cliente de manejador de paquetes es muy sencillo.

![registry](/svg/npm_install.svg)

Puedes usar un registro personalizado bien definiendolo globalmente para todos los projectos

    npm set registry http://localhost:4873
    

o por línea de commandos como argumento `--registry` en npm (ligeramente diferente en yarn)

    npm install lodash --registry http://localhost:4873
    

## Privado

Todos los paquetes que publicas son privados y accesibles basados en tu configuración.

## Proxy

Verdaccio almacena todas las dependencias bajo demanda y acelera las instalaciones en redes locales y privadas.

## Verdaccio en pocas palabras

* It's a web app based on Node.js
* It's a private npm registry
* It's a local network proxy
* It's a Pluggable application
* It's a fairly easy install and use
* We offer Docker and Kubernetes support
* It is 100% compatible with yarn, npm and pnpm
* It was **forked** based on `sinopia@1.4.0` and 100% **backward compatible**.
* Verdaccio means **A green color popular in late medieval Italy for fresco painting**.