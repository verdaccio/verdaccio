---
id: what-is-verdaccio
title: 'What is Verdaccio?'
---

Verdaccio is a **lightweight private npm proxy registry** built in **Node.js**

<iframe width="560" height="315" src="https://www.youtube.com/embed/hDIFKzmoCaA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<div id="codefund">''</div>

## What's a registry

- A repository for packages that implements the **CommonJS Compliant Package Registry specification** for reading package info
- Provide an API compatible with npm clients **(yarn/npm/pnpm)**
- Follow the semantic Versioning compatible **(semver)**

```bash
$ verdaccio 
```

![registry](/assets/verdaccio_server.gif)

## Using Verdaccio

Using verdaccio with any node package manager client is quite straightforward.

![registry](assets/npm_install.gif)

You can use a custom registry either setting globally for all your projects

```bash
npm set registry http://localhost:4873
```

or by command line as argument `--registry` in npm (slightly different in yarn)

```bash
npm install lodash --registry http://localhost:4873
```

## Private

All packages that you publish are private and only accessible based in your configuration.

## Proxy

Verdaccio cache all dependencies by demand and speed up installations in local or private networks.

## Verdaccio in a nutshell

- It's a web app based on Node.js
- It's a private npm registry
- It's a local network proxy
- It's a Pluggable application
- It's a fairly easy install and use
- We offer Docker and Kubernetes support
- It is 100% compatible with yarn, npm and pnpm
- It was **forked** based on `sinopia@1.4.0` and 100% **backward compatible**.
- Verdaccio means **A green color popular in late medieval Italy for fresco painting**.
