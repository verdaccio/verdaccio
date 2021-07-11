---
id: ci
title: "Continuous Integration"
---

Verdaccio kann mit continuous integration (CI) Plattformen für die Installation oder Veröffentlichung von Packeten verwendet werden. Wenn Sie NPM für die installation von privaten Paketen verwenden, können Sie beim ersten mal auf einige Probleme treffen. Der Befehl `npm login` ist auf eine interaktive verwendung ausgelegt. Dies wirft ein Problem im CI, Skripten etc. auf. Unten finden sie einige Artikel, welche die Verwendung von `npm login` in verschiedenen CI-Plattformen erläutern.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) oder [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)