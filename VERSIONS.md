# Versions

The following table describes the versions of this project:

| Version          | Supported          | Minimum Node.js | Branch | Npm Tag          | Docker Images           | Helm Charts | E2E Tests                                                          |
| ---------------- | ------------------ | --------------- | ------ | ---------------- | ----------------------- | ----------- | ------------------------------------------------------------------ |
| 4.x              | :x: (deprecated)   | 10              | 4.x    | latest-4         | 4, 4.x, 4.x.x, 4.x-next | 3.x         | ❌                                                                 |
| 5.x previous     | :x: (deprecated)   | 14              | 5.x    | latest-5         | 5, 5.x, 5.x.x, 5.x-next | 4.0 - 4.18  | ❌                                                                 |
| 6.x current      | :white_check_mark: | 18              | 6.x    | latest-6, latest | 6, 6.x, 6.x.x, 6.x-next | 4.19 - ...  | [e2e-tests/main](https://github.com/verdaccio/e2e-tests/tree/main) |
| 7.x next         | :x:                | 18              | 7.x    | next-7           | 7.x-next                | n/a         | [e2e-tests/6.x](https://github.com/verdaccio/e2e-tests/tree/6.x)   |
| 8.x experimental | :x:                | 18              | master | next-8           | nightly-master          | n/a         | master branch                                                      |

## Migration Guide

Read [the migration guidelines](MIGRATE.md)

### Deprecated Versions

Deprecated versions aren’t supported anymore and shouldn’t be used in production. They don’t get updates—including security fixes—and we don’t run E2E tests on them.
Once the deprecation period is over, the source code will be archived and won’t be maintained anymore.

We try to keep things as backward-compatible as possible, but sometimes deprecating old versions is necessary to keep the project moving forward.

## Npm Registry

The official Verdaccio npm packages are located at https://www.npmjs.com/package/verdaccio.

## Docker Hub

The official Verdaccio Docker Images are found at https://hub.docker.com/r/verdaccio/verdaccio.

## Helms Charts

The official Verdaccio Helm Charts are found at https://artifacthub.io/packages/helm/verdaccio/verdaccio.

## E2E Tests

The e2e test are set of basic test running on each release to ensure the basic functionality of Verdaccio. The tests are located at
different branches, depending on the version. For versions `6.x` and `7.x` the tests are located at the [e2e-test](https://github.com/verdaccio/e2e-tests) and everything else on this repository.
For more details what's being tested, please refer to the [readme file](https://github.com/verdaccio/verdaccio?tab=readme-ov-file#integration-tests) on this repository.
