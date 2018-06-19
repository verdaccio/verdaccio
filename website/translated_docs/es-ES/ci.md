---
id: ci
title: "Integración Continua"
---
Puedes usar verdaccio con la integración continua al inicio de sesión o al publicar. Al momento de usar el NPM para instalar un módulo privado en un entorno de integración continua por primera vez, encontrarás un problema rápidamente. El comando de inicio de sesión del NPM está diseñado para ser utilizado interactivamente. Esto causa un problema en IC, scripts, etc. Aquí se explica cómo usar el inicio de sesión NPM en diferentes plataformas de integración continua.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) ó [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)