---
id: what-is-verdaccio（verdaccio是什么）
title: "Verdaccio是什么？"
---
Verdaccio 是一个 **Node.js**创建的**轻量的私有npm proxy registry**

## Registry是什么？

* 包的资源库，它执行**CommonJS Compliant Package Registry specification** 来阅读包信息
* 提供与npm clients **(yarn/npm/pnpm)**兼容的API
* 效仿Versioning语义兼容**(semver)**

    $> verdaccio
    

![registry](/svg/verdaccio_server.gif)

## 使用Verdaccio

用任何节点包manager client使用 verdaccio是相当简单的。

![registry](/svg/npm_install.gif)

您要么可以用定制registry全局设置所有项目

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