---
id: contributing
title: "Contribuindo com o Verdaccio"
---
First of all Jumping into an unfamiliar code base is not easy but we are here to help you.

## Meios de Comunicação

Se você quiser fazer perguntas, nós usamos dois canais para discussões:

* [Public Discord channel](http://chat.verdaccio.org/)

## Como Começar

As a first glance verdaccio is a single repository, but there are many ways you might contribute and a variety of technologies to practice.

### Como contribuir

Todos nós temos habilidades diferentes, você pode ajudar onde se sentir confortável.

### Eu sei ou quero aprender Node.js

O `Verdaccio` é baseado em Node.js, nós também usamos algumas livrarias como `express`, `commander`, `request` e `async`. Verdaccio is basically a Rest API that create a communication with `npm` clients compatible, as `yarn`.

Nós temos uma longa [lista de plugins](plugins.md) prontos para serem usados e que também aceitam contribuições. Se quiser, [voce pode criar o seu próprio](dev-plugins.md).

### Eu prefiro trabalhar com a Interface do Usuário

Recentemente nós começamos a usar tecnologias mais modernas, como `React` e `element-react`. Estamos abertos a novas ideias para melhorar a UI.

### I feel more confortable improving the stack

Of course, we will be happy to help us improving the stack, you can upgrade dependencies as `eslint`, `stylelint`, `webpack`. You might merely improve the `webpack` configuration would be great. Any suggestion is very welcome. Furthermore whether you have experience with **Yeoman** you might help us with the [verdaccio generator](https://github.com/verdaccio/generator-verdaccio-plugin).

Here some ideas:

* Create a common eslint rules to be used across all dependencies or plugins
* Improve Flow types definitions delivery
* Moving to Webpack 4
* Improve hot reload with Webpack
* We use babel and webpack across all dependencies, why not a common preset?
* Improve continous integration delivery

### I do great Documentation

Many contributors find typos and grammar issues, that also helps to improve the overall experience for troubleshooting.

### I am a Designer

Nós temos uma página inicial <http://www.verdaccio.org/> que ficaria muito boa com novas ideias.

Nosso site é gerado com [Docusaurus](https://docusaurus.io/).

### Eu sou um DevOps

We have a widely popular Docker image <https://hub.docker.com/r/verdaccio/verdaccio/> that need maintenance and pretty likely huge improvements, we need your knowledge for the benefits of all users.

We have support for **Kubernetes**, **Puppet**, **Ansible** and **Chef** and we need help in those fields, feel free to see all repositories.

### Eu posso traduzir

Nosso projeto busca ser multilíngue, e contamos **com a ótima ajuda** do [Crowdin](https://crowdin.com) que é uma ótima plataforma para traduções.

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

We have setup a project where you can choose your favourite language, if you do not find your language feel free to request one [creating a ticket](https://github.com/verdaccio/verdaccio/issues/new).

[Go to Crowdin Verdaccio](https://crowdin.com/project/verdaccio)

## I'm ready to contribute

If you are thinking *"I've seen already the [repositories](repositories.md) and I'm willing to start right away"* then I have good news for you, that's the next step.

You will need learn how to build, [we have prepared a guide just for that](build.md).

Once you have played around with all scripts and you know how to use them, we are ready to go to the next step, run the [**Unit Test**](test.md).

## Full list of contributors. We want to see your face here !

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
