---
id: contributing
title: "Содействие Verdaccio"
---
First of all Нырять в незнакомую кодовую базу не просто, но мы здесь для того, чтобы помочь вам.

## Каналы связи

Если вы готовы задать вопрос, мы используем два канала для обсуждений:

* [Публичный Discord канал](http://chat.verdaccio.org/)

## Приступая к работе

На первый взгляд verdaccio представляет собой единый репозиторий, но есть много способов, которыми вы могли бы посодействовать. А так же есть разнообразные технологии для практики.

### Занять свою нишу

Все мы имеем различные навыки, так что, давайте посмотрим, где вы можете чувствовать себя комфортно.

### Я знаю, или я хочу узнать Node.js

Node.js это основа `verdaccio`, мы используем такие библиотеки как `express`, `commander`, `request` или `async`. Verdaccio это в основном Rest API который обеспечивает коммуникацию `npm` совместимых клиентов, таких как `yarn`.

Мы имеем длинный [список плагинов](plugins.md) готовых к использованию и улучшению, но в тоже время [вы можете создать свой собственный](dev-plugins.md).

### Я бы предпочел работать с пользовательским интерфейсом

Недавно мы переехали на современные технологии, такие как `React` и `element-react`. Мы с нетерпением ожидаем увидеть новые идеи для улучшения пользовательского интерфейса.

### Мне гораздо комфортнее улучшать стек технологий

Разумеется мы будем рады помощи в улучшении стека, вы можете обновить зависимости, такие как `eslint`, `stylelint`, `webpack`. Вы можете просто улучшить `webpack` конфигурацию. Это было бы здорово. Мы рады приветствовать любые ваши предложения. Кроме того, если у вас есть опыт работы с **Yeoman** вы можете помочь нам с [генератором verdaccio](https://github.com/verdaccio/generator-verdaccio-plugin).

Вот некоторые идеи:

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
