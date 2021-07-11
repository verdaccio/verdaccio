---
id: ci
title: "Непрерывная интеграция (CI)"
---

Verdaccio может быть использован в платформах непрерывной интеграции (CI), для загрузки или публикации пакетов. Когда вы используете NPM для загрузки приватного пакета в окружении CI в первый раз, вы можете столкнуться с проблемами. Команда `npm login` спроектирована так, что требует ответа от пользователя. Это - проблема для CI, скриптов, и т. д. Ниже - несколько статей о том, как использовать команду `npm login` на различных CI-платформах.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) или [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)