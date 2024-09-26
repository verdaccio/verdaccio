---
id: ci
title: 'Continuous Integration'
---

Verdaccio can be used with continuous integration (CI) platforms to install or publish packages.
When using NPM to install a private package in a CI environment for the first time, you may run
into some issues. The `npm login` command is designed to be used interactively. This poses an
issue in CI, scripts, etc. Below are some articles detailing how to use `npm login` on different
CI platforms.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI](https://circleci.com/docs/deploy-to-npm-registry)
- [GitHub Actions](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)
