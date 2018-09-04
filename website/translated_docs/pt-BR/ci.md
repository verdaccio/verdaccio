---
id: ci
title: "Integração contínua"
---
Você pode usar verdaccio com integração contínua enquanto login ou publish. When using NPM to install a private module in a continuous integration environment for the first time, a brick wall is quickly hit. O comando de login NPM é, projetado para ser usado interativamente. Isso causará um problema na Integração Contínua, scripts e etc. Here’s how to use NPM login different continuous integration platforms.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)