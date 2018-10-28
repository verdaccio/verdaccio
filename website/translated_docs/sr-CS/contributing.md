---
id: doprinošenje
title: "Doprinošenje Verdaccio-u"
---
First of all Plivanje u vodama nepoznatog koda nije lako ali, mi smo tu da Vam pomognemo.

## Kanali za komunikaciju

Ako ste voljni da pitate, na raspolaganju su dva kanala za diskusiju:

* [Javni Discord kanal](http://chat.verdaccio.org/)

## Hajde da počnemo

Na prvi pogled, verdaccio je jedinstveni repozitorijum, ali u praksi postoje mnogi načini da doprinesete razvoju i upotrebite tehnologiju.

### Nađite svoje mesto pod suncem

Svi mi posedujemo različite veštine, hajde da otkrijemo gde je kome udobno.

### Znam ili želim da naučim Node.js

Node.js je osnova `verdaccio`. Koristimo biblioteke kao `express`, `commander`, `request` ili `async`. Verdaccio je praktično Rest API koji uspostavlja komunikaciju sa `npm` klijent-kompatibilnim, kao što je `yarn`.

We have a long [list of plugins](plugins.md) ready to be used and improved but at the same time [you might create your own](dev-plugins.md).

### I would prefer to work in the User Interface

Recently we have moved to modern techonologies as `React` and `element-react`. We are looking forward to see new ideas how to improve the UI.

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
