---
id: ci
title: "Ciągła integracja"
---
Możesz używać verdaccio z ciągłą integracją podczas logowania i publikowania. When using NPM to install a private module in a continuous integration environment for the first time, a brick wall is quickly hit. Komenda logowania NPM jest zaprojektowana do użytku interaktywnego. Powoduje to problem w CI, skryptach, itp. Oto jak korzystać z logowania NPM na różnych platformach ciągłej integracji.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)