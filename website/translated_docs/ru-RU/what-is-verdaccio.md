---
id: what-is-verdaccio
title: "Что такое Verdaccio?"
---

Verdaccio - это **легкий приватный проксирующий npm-репозиторий**, сделанный на **Node.js** <iframe width="560" height="315" src="https://www.youtube.com/embed/hDIFKzmoCaA?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe> 

## What's a registry?

* A registry is a repository for packages, that implements the **CommonJS Compliant Package Registry specification** for reading package's information.
* Provide a compatible API with npm clients **(yarn/npm/pnpm)**.
* Semantic Versioning compatible **(semver)**.

    $> verdaccio
    

![реестр](assets/verdaccio_server.gif)

## Использование Verdaccio

Using Verdaccio with any Node.js package manager client is quite straightforward.

![реестр](assets/npm_install.gif)

You can use a custom registry either by setting it globally for all your projects

    npm set registry http://localhost:4873
    

or by using it in command line as an argument `--registry` in npm (slightly different in yarn)

    npm install lodash --registry http://localhost:4873
    

    yarn config set registry http://localhost:4873
    

## Приватный

Все пакеты, которые вы опубликуете - приватные, и доступ к ним осуществляется в соотвествии с правами, опредёленными в конфигурации.

## Прокси

Verdaccio cache all dependencies on demand and speed up installations in local or private networks.

## In a Nutshell

* Веб-приложение на Node
* Приватный npm-реестр
* Прокси для локальной сети
* Возможно подключение плагинов
* It's fairly easy to install and to use
* Поддержка Docker и Kubernetes
* 100% совместим с yarn, npm и pnpm
* Verdaccio means **A green color popular in late medieval Italy for fresco painting**.