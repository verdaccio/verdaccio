---
id: ci
title: "Continuous Integration"
---

Verdaccio can be used with continuous integration (CI) platforms to install or publish packages.
When using NPM to install a private package in a CI environment for the first time, you may run
into some issues. The `npm login` command is designed to be used interactively. This poses an
issue in CI, scripts, etc. Below are some articles detailing how to use `npm login` on different
CI platforms.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)
