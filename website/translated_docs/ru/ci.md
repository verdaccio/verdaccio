---
id: ci
title: "Непрерывная интеграция"
---
Вы можете использовать verdaccio с системами непрерывной интеграции при входе или публикации. Когда вы используете NPM для установки приватного модуля в окружении непрерывной интерграции, то вы сразу упираетесь в кирпичную стену. Вход, в команде NPM, был разработана для интерактивного использования. Это вызывает проблемы в CI, скриптах и т.п. Вот как нужно использовать NPM вход на различных платформах непрерывной интеграции.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) или [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)