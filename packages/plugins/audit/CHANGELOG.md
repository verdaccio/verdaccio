# Change Log

## 10.0.0-alpha.2

### Minor Changes

- 54c58d1e: feat: add server rate limit protection to all request

  To modify custom values, use the server settings property.

  ```markdown
  server:

  ## https://www.npmjs.com/package/express-rate-limit#configuration-options

  rateLimit:
  windowMs: 1000
  max: 10000
  ```

  The values are intended to be high, if you want to improve security of your server consider
  using different values.

## 10.0.0-alpha.1

### Major Changes

- d87fa026: feat!: experiments config renamed to flags

  - The `experiments` configuration is renamed to `flags`. The functionality is exactly the same.

  ```js
  flags: token: false;
  search: false;
  ```

  - The `self_path` property from the config file is being removed in favor of `config_file` full path.
  - Refactor `config` module, better types and utilities

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.7.3](https://github.com/verdaccio/monorepo/compare/v9.7.2...v9.7.3) (2020-07-30)

### Bug Fixes

- update marked / request security vulnerability ([#378](https://github.com/verdaccio/monorepo/issues/378)) ([4188e08](https://github.com/verdaccio/monorepo/commit/4188e088f42d0f6e090c948b869312ba1f30cd79))

## [9.7.2](https://github.com/verdaccio/monorepo/compare/v9.7.1...v9.7.2) (2020-07-20)

**Note:** Version bump only for package verdaccio-audit

## [9.7.1](https://github.com/verdaccio/monorepo/compare/v9.7.0...v9.7.1) (2020-07-10)

**Note:** Version bump only for package verdaccio-audit

# [9.7.0](https://github.com/verdaccio/monorepo/compare/v9.6.1...v9.7.0) (2020-06-24)

**Note:** Version bump only for package verdaccio-audit

## [9.6.1](https://github.com/verdaccio/monorepo/compare/v9.6.0...v9.6.1) (2020-06-07)

**Note:** Version bump only for package verdaccio-audit

# [9.5.0](https://github.com/verdaccio/monorepo/compare/v9.4.1...v9.5.0) (2020-05-02)

**Note:** Version bump only for package verdaccio-audit

# [9.4.0](https://github.com/verdaccio/monorepo/compare/v9.3.4...v9.4.0) (2020-03-21)

**Note:** Version bump only for package verdaccio-audit

## [9.3.2](https://github.com/verdaccio/monorepo/compare/v9.3.1...v9.3.2) (2020-03-08)

**Note:** Version bump only for package verdaccio-audit

## [9.3.1](https://github.com/verdaccio/monorepo/compare/v9.3.0...v9.3.1) (2020-02-23)

**Note:** Version bump only for package verdaccio-audit

# [9.3.0](https://github.com/verdaccio/monorepo/compare/v9.2.0...v9.3.0) (2020-01-29)

**Note:** Version bump only for package verdaccio-audit

# [9.0.0](https://github.com/verdaccio/monorepo/compare/v8.5.3...v9.0.0) (2020-01-07)

**Note:** Version bump only for package verdaccio-audit

## [8.5.2](https://github.com/verdaccio/monorepo/compare/v8.5.1...v8.5.2) (2019-12-25)

**Note:** Version bump only for package verdaccio-audit

## [8.5.1](https://github.com/verdaccio/monorepo/compare/v8.5.0...v8.5.1) (2019-12-24)

**Note:** Version bump only for package verdaccio-audit

# [8.5.0](https://github.com/verdaccio/monorepo/compare/v8.4.2...v8.5.0) (2019-12-22)

**Note:** Version bump only for package verdaccio-audit

## [8.4.2](https://github.com/verdaccio/monorepo/compare/v8.4.1...v8.4.2) (2019-11-23)

**Note:** Version bump only for package verdaccio-audit

## [8.4.1](https://github.com/verdaccio/monorepo/compare/v8.4.0...v8.4.1) (2019-11-22)

**Note:** Version bump only for package verdaccio-audit

# [8.4.0](https://github.com/verdaccio/monorepo/compare/v8.3.0...v8.4.0) (2019-11-22)

**Note:** Version bump only for package verdaccio-audit

# [8.3.0](https://github.com/verdaccio/monorepo/compare/v8.2.0...v8.3.0) (2019-10-27)

**Note:** Version bump only for package verdaccio-audit

# [8.2.0](https://github.com/verdaccio/monorepo/compare/v8.2.0-next.0...v8.2.0) (2019-10-23)

**Note:** Version bump only for package verdaccio-audit

# [8.2.0-next.0](https://github.com/verdaccio/monorepo/compare/v8.1.4...v8.2.0-next.0) (2019-10-08)

### Bug Fixes

- fixed lint errors ([c80e915](https://github.com/verdaccio/monorepo/commit/c80e915))

## [8.1.4](https://github.com/verdaccio/monorepo/compare/v8.1.3...v8.1.4) (2019-09-30)

**Note:** Version bump only for package verdaccio-audit

## [8.1.3](https://github.com/verdaccio/monorepo/compare/v8.1.2...v8.1.3) (2019-09-30)

**Note:** Version bump only for package verdaccio-audit

## [8.1.2](https://github.com/verdaccio/monorepo/compare/v8.1.1...v8.1.2) (2019-09-29)

**Note:** Version bump only for package verdaccio-audit

## [8.1.1](https://github.com/verdaccio/monorepo/compare/v8.1.0...v8.1.1) (2019-09-26)

**Note:** Version bump only for package verdaccio-audit

# [8.1.0](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.1...v8.1.0) (2019-09-07)

**Note:** Version bump only for package verdaccio-audit

## [8.0.1-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.0...v8.0.1-next.1) (2019-08-29)

**Note:** Version bump only for package verdaccio-audit

## [8.0.1-next.0](https://github.com/verdaccio/monorepo/compare/v8.0.0...v8.0.1-next.0) (2019-08-29)

**Note:** Version bump only for package verdaccio-audit

# [8.0.0](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.4...v8.0.0) (2019-08-22)

**Note:** Version bump only for package verdaccio-audit

# [8.0.0-next.4](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.3...v8.0.0-next.4) (2019-08-18)

**Note:** Version bump only for package verdaccio-audit

# [8.0.0-next.2](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.1...v8.0.0-next.2) (2019-08-03)

**Note:** Version bump only for package verdaccio-audit

# [8.0.0-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.0...v8.0.0-next.1) (2019-08-01)

**Note:** Version bump only for package verdaccio-audit

# [8.0.0-next.0](https://github.com/verdaccio/monorepo/compare/v2.0.0...v8.0.0-next.0) (2019-08-01)

### Bug Fixes

- on error returns 500 by default ([86bf628](https://github.com/verdaccio/monorepo/commit/86bf628))
- package.json to reduce vulnerabilities ([457a791](https://github.com/verdaccio/monorepo/commit/457a791))

### Features

- add audit quick endpoint ([5ab2ece](https://github.com/verdaccio/monorepo/commit/5ab2ece))
- migrate to typescript ([caffcd5](https://github.com/verdaccio/monorepo/commit/caffcd5))
- proxy npm audit endpoint ([b11151d](https://github.com/verdaccio/monorepo/commit/b11151d))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.1](https://github.com/verdaccio/verdaccio-audit/compare/v1.2.0...v1.2.1) (2019-07-29)

### Bug Fixes

- audit module doesn't support strict_ssl flag ([f7d3f86](https://github.com/verdaccio/verdaccio-audit/commit/f7d3f86))

### Build System

- update dependencies ([ddaa990](https://github.com/verdaccio/verdaccio-audit/commit/ddaa990))

# [1.2.0](https://github.com/verdaccio/verdaccio-audit/compare/v1.1.0...v1.2.0) (2019-04-06)

### Bug Fixes

- bad network causes the server down ([2c838b4](https://github.com/verdaccio/verdaccio-audit/commit/2c838b4))
- types error ([16d623e](https://github.com/verdaccio/verdaccio-audit/commit/16d623e))

### Features

- migrate to typescript ([bec6824](https://github.com/verdaccio/verdaccio-audit/commit/bec6824))

<a name="1.1.0"></a>

# [1.1.0](https://github.com/verdaccio/verdaccio-audit/compare/v1.0.1...v1.1.0) (2019-01-09)

### Features

- pipe request and response bodies to save memory ([#8](https://github.com/verdaccio/verdaccio-audit/issues/8)) ([0af7363](https://github.com/verdaccio/verdaccio-audit/commit/0af7363))

<a name="1.0.1"></a>

## [1.0.1](https://github.com/verdaccio/verdaccio-audit/compare/v1.0.0...v1.0.1) (2019-01-09)

### Bug Fixes

- package.json to reduce vulnerabilities ([bdf35df](https://github.com/verdaccio/verdaccio-audit/commit/bdf35df))

<a name="1.0.0"></a>

# [1.0.0](https://github.com/verdaccio/verdaccio-audit/compare/v0.2.0...v1.0.0) (2018-10-18)

### Features

- handle 'application/json, application/octet-stream' content types ([cf38a38](https://github.com/verdaccio/verdaccio-audit/commit/cf38a38))

<a name="0.2.0"></a>

# [0.2.0](https://github.com/verdaccio/verdaccio-audit/compare/v0.1.0...v0.2.0) (2018-06-15)

### Features

- support audit via HTTPS proxy ([5328bc3](https://github.com/verdaccio/verdaccio-audit/commit/5328bc3))
