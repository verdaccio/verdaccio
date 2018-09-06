---
id: ci
title: "Integrazione continua"
---
Potete utilizzare verdaccio con integrazione continua mentre effettuate il login o pubblicate. Quando si usa NPM per installare un modulo privato in un ambiente di integrazione continua per la prima volta, si fallisce rapidamente. Il comando di login NPM è progettato per essere utilizzato in modo interattivo. This causes an issue in CI, scripts, etc. Here’s how to use NPM login different continuous integration platforms.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)