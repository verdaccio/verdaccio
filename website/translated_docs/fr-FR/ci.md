---
id: ci
title: "Intégration Continue"
---
Vous pouvez utiliser verdaccio avec une intégration continue lors de la connexion ou de la publication. Lorsque vous utilisez NPM pour installer un module privé dans un environnement d'intégration continue pour la première fois, vous rencontrez immédiatement un problème. La commande de connexion NPM est conçue pour être utilisée de manière interactive. Cela pose un problème dans les CI, les scripts, etc. Ici, vous trouverez comment utiliser NPM pour accéder à différentes plates-formes d'intégration continue.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) ou [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)