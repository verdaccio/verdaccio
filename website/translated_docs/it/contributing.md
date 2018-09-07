---
id: contributing
title: "Contribuendo a Verdaccio"
---
First of all Jumping into an unfamiliar code base is not easy but we are here to help you.

## Canali di comunicazione

Se desideri fare domande, usiamo due canali per le discussioni:

* [Canale pubblico Discord](http://chat.verdaccio.org/)

## Guida introduttiva

A prima vista verdaccio è un unico repository, ma ci sono molti modi in cui potresti contribuire e una ampia varietà di tecnologie da usare.

### Trovare il mio posto

Tutti noi abbiamo competenze diverse, quindi, vediamo dove ti potresti sentire a tuo agio.

### Conosco o voglio imparare Node.js

Node.js è la base di `verdaccio`, usiamo librerie come `express`, `commander,``request ` o `async`. Verdaccio è fondamentalmente un'API Rest che crea una comunicazione con i client `npm` compatibili, come `yarn`.

Abbiamo una lunga [lista di plugin](plugins.md) pronti per essere utilizzati e migliorati, ma al tempo stesso [è possibile crearne uno proprio](dev-plugins.md).

### Preferirei lavorare nell'Interfaccia Utente

Recentemente ci siamo spostati su tecnologie moderne come `React` e `element-react`. Siamo ansiosi vedere nuove idee su come migliorare l'interfaccia utente.

### Mi sento più a mio agio a migliorare lo stack

Naturalmente, saremo felici se ci aiutassi a migliorare lo stack, è possibile aggiornare le dipendenze come `eslint`, `stylelint`, `webpack`. Sarebbe di grande aiuto se potessi semplicemente migliorare la configurazione di `webpack`. Ogni suggerimento è molto gradito. Inoltre se avessi esperienza con **Yeoman** potresti aiutarci con il [generatore di verdaccio](https://github.com/verdaccio/generator-verdaccio-plugin).

Qui alcune idee:

* Creare regole comuni di eslint per l'uso in tutte le dipendenze o plugin
* Improve Flow types definitions delivery
* Moving to Webpack 4
* Improve hot reload with Webpack
* We use babel and webpack across all dependencies, why not a common preset?
* Improve continous integration delivery

### I do great Documentation

Many contributors find typos and grammar issues, that also helps to improve the overall experience for troubleshooting.

### I am a Designer

We have a frontend website <http://www.verdaccio.org/> that will be happy to see your ideas.

Our website is based on [Docusaurus](https://docusaurus.io/).

### I am a DevOps

We have a widely popular Docker image <https://hub.docker.com/r/verdaccio/verdaccio/> that need maintenance and pretty likely huge improvements, we need your knowledge for the benefits of all users.

We have support for **Kubernetes**, **Puppet**, **Ansible** and **Chef** and we need help in those fields, feel free to see all repositories.

### I can do translations

Verdaccio aims to be multilingual, in order to achieve it **we have the awesome support** of [Crowdin](https://crowdin.com) that is an amazing platform for translations.

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

We have setup a project where you can choose your favourite language, if you do not find your language feel free to request one [creating a ticket](https://github.com/verdaccio/verdaccio/issues/new).

[Go to Crowdin Verdaccio](https://crowdin.com/project/verdaccio)

## I'm ready to contribute

If you are thinking *"I've seen already the [repositories](repositories.md) and I'm willing to start right away"* then I have good news for you, that's the next step.

You will need learn how to build, [we have prepared a guide just for that](build.md).

Once you have played around with all scripts and you know how to use them, we are ready to go to the next step, run the [**Unit Test**](test.md).

## Full list of contributors. We want to see your face here !

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
