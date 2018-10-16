---
id: contribuant
title: "Contribuer à Verdaccio"
---
First of all Passer à une base de code inconnue n'est pas facile, mais nous sommes là pour vous aider.

## Canaux de communication

Si vous souhaitez poser des questions, nous utilisons deux canaux de discussion:

* [Chaîne publique de Discord](http://chat.verdaccio.org/)

## Commencer

À première vue, verdaccio est un référentiel unique, mais il existe de nombreuses façons de contribuer et une grande variété de technologies à utiliser.

### Trouver ma place

Nous avons tous des compétences différentes, alors voyons où vous pouvez vous sentir confortable.

### Je connais ou je veux en apprendre Node.js

Node.js est la base de `verdaccio`, nous utilisons des bibliothèques comme `express`, `commander`, `request` ou `async`. Verdaccio est essentiellement un API Rest qui crée une communication avec les clients `npm`, comme `yarn`.

Nous avons une longue [liste de plugins](plugins.md) prête à être utilisée et améliorée, mais en même temps, [vous pouvez créer votre propre liste](dev-plugins.md).

### J'aurais préférer travailler dans l’Interface utilisateur

Récemment, nous sommes passés à des techonologies moderne comme `React` et `element-react`. Nous sommes impatients de voir de nouvelles idées pour améliorer l’Interface Utilisateur.

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

### Je suis un DevOps

Nous avons une image très populaire sur Docker [ https://hub.docker.com/r/verdaccio/verdaccio/](https://hub.docker.com/r/verdaccio/verdaccio/) qui a besoin de maintenance et d’énormes améliorations, nous avons donc besoin de vos connaissances pour que tous les utilisateurs en bénéficient.

Nous avons un soutien pour **Kubernetes**, ** Puppet**, **Ansible** et **Chef** et nous avons besoin d'aide dans ces domaines, n'hésitez pas à voir tous les dépôts.

### Je peux faire des traductions

Verdaccio vise à être multilingue et, pour atteindre cet objectif, **nous bénéficions du soutien important** de [Crowdin](https://crowdin.com), qui est une plate-forme stupéfiante pour les traductions.

<img src="https://d3n8a8pro7vhmx.cloudfront.net/uridu/pages/144/attachments/original/1485948891/Crowdin.png" width="400px" />

Nous avons mis en place un projet dans lequel vous pouvez choisir la langue que vous préférez. Si vous ne trouvez pas la langue qui vous convient, n'hésitze pas à demander une en [créant un ticket](https://github.com/verdaccio/verdaccio/issues/new).

[Aller à Crowdin Verdaccio](https://crowdin.com/project/verdaccio)

## Je suis prêt à contribuer

Si vous pensez que *"J'ai déjà vu les [dépôts](repositories.md) et je souhaite commencer tout de suite"*, alors j'ai bien de bonnes nouvelles pour toi, Voici l'étape suivante.

Vous devrez apprendre à créer un projet, [nous avons préparé un guide à cet effet](build.md).

Une fois que vous vous êtes amusés avec tous les scripts et que vous avez compris comment les utiliser, nous sommes prêts pour passer à l'étape suivante: exécutez le [**Test unitaire**](test.md).

## Liste complète des contributeurs. Nous souhaitons voir votre visage ici !

<a href="graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>
