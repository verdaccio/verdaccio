---
id: version-3.2.0-ci
title: Continuous Integration
original_id: ci
---

You may use verdaccio with continuous integration while login or publish. When
using NPM to install a private module in a continuous integration environment
for the first time, a brick wall is quickly hit. The NPM login command is
designed to be used interactively. This causes an issue in CI, scripts, etc.
Here’s how to use NPM login different continuous integration platforms.

- [Travis CI](https://remysharp.com/2015/10/26/using-travis-with-private-npm-deps)
- [Circle CI 1.0](https://circleci.com/docs/1.0/npm-login/) or [Circle CI 2.0](https://circleci.com/docs/2.0/deployment-integrations/#npm)
- [Gitlab CI](https://www.exclamationlabs.com/blog/continuous-deployment-to-npm-using-gitlab-ci/)
