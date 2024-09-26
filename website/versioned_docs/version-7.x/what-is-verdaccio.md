---
id: what-is-verdaccio
title: 'What is Verdaccio?'
---

Verdaccio is a **lightweight private npm proxy registry** built in **Node.js**

Using a private npm registry like Verdaccio is one of the [Top 10 NPM Security Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html#6-use-a-local-npm-proxy)
recommended by the Open Web Application Security Project ([OWASP](https://owasp.org/)).

<iframe width="560" height="515" src="https://www.youtube.com/embed/qRMucS3i3kQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## What's a registry? {#whats-a-registry}

- A registry is a repository for packages, that implements the **CommonJS Compliant Package Registry specification** for reading package's information.
- Provide a compatible API with npm clients **(yarn/npm/pnpm)**.
- Semantic Versioning compatible **(semver)**.

```bash
$> verdaccio
```

![registry](/img/verdaccio_server.gif)

## Using Verdaccio {#using-verdaccio}

Using Verdaccio with any Node.js package manager client is quite straightforward.

![registry](/img/npm_install.gif)

You can use a custom registry either by setting it globally for all your projects

```bash
npm set registry http://localhost:4873
```

or by using it in command line as an argument `--registry` in npm (slightly different in yarn)

```bash
npm install lodash --registry http://localhost:4873
```

```bash
yarn config set registry http://localhost:4873
```

To have a more detailed explanation, I invite you to watch the full explanation **Angular Library: How To Use a Library in a poly-repo Using Verdaccio** by [_Fanis Prodromou_](https://twitter.com/prodromouf) on his [YouTube channel](https://www.youtube.com/channel/UCgJAoZCYx1Dk3iGPHSIgV1A).

<iframe width="560" height="515" src="https://www.youtube.com/embed/tSIC3wna_d0?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Private {#private}

All packages that you publish are private and only accessible based in your configuration.

## Proxy {#proxy}

Verdaccio cache all dependencies on demand and speed up installations in local or private networks.

## In a Nutshell {#in-a-nutshell}

- It's a web app based on Node.js
- It's a private npm registry
- It's a local network proxy
- It's a Pluggable application
- It's fairly easy to install and to use
- We offer Docker and Kubernetes support
- It is 100% compatible with yarn, npm and pnpm
- Verdaccio means **A green color popular in late medieval Italy for fresco painting**.
