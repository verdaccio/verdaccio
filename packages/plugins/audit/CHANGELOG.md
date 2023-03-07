# Change Log

## 11.0.0-6-next.28

### Patch Changes

- Updated dependencies [a1da1130]
  - @verdaccio/core@6.0.0-6-next.65
  - @verdaccio/config@6.0.0-6-next.65

## 11.0.0-6-next.27

### Patch Changes

- Updated dependencies [974cd8c1]
  - @verdaccio/core@6.0.0-6-next.64
  - @verdaccio/config@6.0.0-6-next.64

## 11.0.0-6-next.26

### Patch Changes

- Updated dependencies [ddb6a223]
- Updated dependencies [dc571aab]
  - @verdaccio/config@6.0.0-6-next.63
  - @verdaccio/core@6.0.0-6-next.63

## 11.0.0-6-next.25

### Patch Changes

- Updated dependencies [378e907d]
  - @verdaccio/core@6.0.0-6-next.62
  - @verdaccio/config@6.0.0-6-next.62

## 11.0.0-6-next.24

### Patch Changes

- Updated dependencies [d167f92e]
  - @verdaccio/config@6.0.0-6-next.61
  - @verdaccio/core@6.0.0-6-next.61

## 11.0.0-6-next.23

### Minor Changes

- 45c03819: refactor: render html middleware

### Patch Changes

- Updated dependencies [45c03819]
  - @verdaccio/config@6.0.0-6-next.60
  - @verdaccio/core@6.0.0-6-next.60

## 11.0.0-6-next.22

### Patch Changes

- Updated dependencies [65f88b82]
  - @verdaccio/logger@6.0.0-6-next.27
  - @verdaccio/core@6.0.0-6-next.59
  - @verdaccio/config@6.0.0-6-next.59

## 11.0.0-6-next.21

### Patch Changes

- @verdaccio/core@6.0.0-6-next.58
- @verdaccio/config@6.0.0-6-next.58
- @verdaccio/logger@6.0.0-6-next.26

## 11.0.0-6-next.20

### Patch Changes

- @verdaccio/core@6.0.0-6-next.57
- @verdaccio/config@6.0.0-6-next.57
- @verdaccio/logger@6.0.0-6-next.25

## 11.0.0-6-next.19

### Patch Changes

- @verdaccio/config@6.0.0-6-next.56
- @verdaccio/core@6.0.0-6-next.56
- @verdaccio/logger@6.0.0-6-next.24

## 11.0.0-6-next.18

### Patch Changes

- Updated dependencies [9718e033]
  - @verdaccio/config@6.0.0-6-next.55
  - @verdaccio/core@6.0.0-6-next.55
  - @verdaccio/logger@6.0.0-6-next.23

## 11.0.0-6-next.17

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/config@6.0.0-6-next.54
  - @verdaccio/core@6.0.0-6-next.54
  - @verdaccio/logger@6.0.0-6-next.22

## 11.0.0-6-next.16

### Patch Changes

- @verdaccio/core@6.0.0-6-next.53
- @verdaccio/logger@6.0.0-6-next.21
- @verdaccio/config@6.0.0-6-next.53

## 11.0.0-6-next.15

### Patch Changes

- @verdaccio/core@6.0.0-6-next.52
- @verdaccio/config@6.0.0-6-next.52
- @verdaccio/logger@6.0.0-6-next.20

## 11.0.0-6-next.14

### Patch Changes

- Updated dependencies [4b29d715]
  - @verdaccio/config@6.0.0-6-next.51
  - @verdaccio/core@6.0.0-6-next.51
  - @verdaccio/logger@6.0.0-6-next.19

## 11.0.0-6-next.13

### Patch Changes

- @verdaccio/core@6.0.0-6-next.50
- @verdaccio/config@6.0.0-6-next.50
- @verdaccio/logger@6.0.0-6-next.18

## 11.0.0-6-next.12

### Patch Changes

- @verdaccio/core@6.0.0-6-next.49
- @verdaccio/config@6.0.0-6-next.49
- @verdaccio/logger@6.0.0-6-next.17

## 11.0.0-6-next.11

### Major Changes

- 9fc2e796: feat(plugins): improve plugin loader

  ### Changes

  - Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
  - Avoid config collisions https://github.com/verdaccio/verdaccio/issues/928
  - https://github.com/verdaccio/verdaccio/issues/1394
  - `config.plugins` plugin path validations
  - Updated algorithm for plugin loader.
  - improved documentation (included dev)

  ## Features

  - Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
  - Custom prefix:

  ```
  // config.yaml
  server:
    pluginPrefix: mycompany
  middleware:
    audit:
        foo: 1
  ```

  This configuration will look up for `mycompany-audit` instead `Verdaccio-audit`.

  ## Breaking Changes

  ### sinopia plugins

  - `sinopia` fallback support is removed, but can be restored using `pluginPrefix`

  ### plugin filter

  - method rename `filter_metadata`->`filterMetadata`

  ### Plugin constructor does not merge configs anymore https://github.com/verdaccio/verdaccio/issues/928

  The plugin receives as first argument `config`, which represents the config of the plugin. Example:

  ```
  // config.yaml
  auth:
    plugin:
       foo: 1
       bar: 2

  export class Plugin<T> {
    public constructor(config: T, options: PluginOptions) {
      console.log(config);
      // {foo:1, bar: 2}
   }
  }
  ```

## 11.0.0-6-next.10

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage

## 11.0.0-6-next.9

### Major Changes

- 292c0a37: feat!: replace deprecated request dependency by got

  This is a big refactoring of the core, fetching dependencies, improve code, more tests and better stability. This is essential for the next release, will take some time but would allow modularize more the core.

  ## Notes

  - Remove deprecated `request` by other `got`, retry improved, custom Agent ( got does not include it built-in)
  - Remove `async` dependency from storage (used by core) it was linked with proxy somehow safe to remove now
  - Refactor with promises instead callback wherever is possible
  - ~Document the API~
  - Improve testing, integration tests
  - Bugfix
  - Clean up old validations
  - Improve performance

  ## 💥 Breaking changes

  - Plugin API methods were callbacks based are returning promises, this will break current storage plugins, check documentation for upgrade.
  - Write Tarball, Read Tarball methods parameters change, a new set of options like `AbortController` signals are being provided to the `addAbortSignal` can be internally used with Streams when a request is aborted. eg: `addAbortSignal(signal, fs.createReadStream(pathName));`
  - `@verdaccio/streams` stream abort support is legacy is being deprecated removed
  - Remove AWS and Google Cloud packages for future refactoring [#2574](https://github.com/verdaccio/verdaccio/pull/2574).

- a3a209b5: feat: migrate to pino.js 8

## 11.0.0-6-next.8

### Minor Changes

- 24b9be02: refactor: improve docker image build with strict dependencies and prod build

## 11.0.0-6-next.7

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

## 11.0.0-6-next.6

### Major Changes

- 459b6fa7: refactor: search v1 endpoint and local-database

  - refactor search `api v1` endpoint, improve performance
  - remove usage of `async` dependency https://github.com/verdaccio/verdaccio/issues/1225
  - refactor method storage class
  - create new module `core` to reduce the ammount of modules with utilities
  - use `undici` instead `node-fetch`
  - use `fastify` instead `express` for functional test

  ### Breaking changes

  - plugin storage API changes
  - remove old search endpoint (return 404)
  - filter local private packages at plugin level

  The storage api changes for methods `get`, `add`, `remove` as promise base. The `search` methods also changes and recieves a `query` object that contains all query params from the client.

  ```ts
  export interface IPluginStorage<T> extends IPlugin {
    add(name: string): Promise<void>;
    remove(name: string): Promise<void>;
    get(): Promise<any>;
    init(): Promise<void>;
    getSecret(): Promise<string>;
    setSecret(secret: string): Promise<any>;
    getPackageStorage(packageInfo: string): IPackageStorage;
    search(query: searchUtils.SearchQuery): Promise<searchUtils.SearchItem[]>;
    saveToken(token: Token): Promise<any>;
    deleteToken(user: string, tokenKey: string): Promise<any>;
    readTokens(filter: TokenFilter): Promise<Token[]>;
  }
  ```

## 11.0.0-6-next.5

### Patch Changes

- f96b147e: fix: several issues which caused the audit to fail (#2335)

## 10.0.0-alpha.4

### Major Changes

- f8a50baa: feat: standalone registry with no dependencies

  ## Usage

  To install a server with no dependencies

  ```bash
  npm install -g @verdaccio/standalone
  ```

  with no internet required

  ```bash
  npm install -g ./tarball.tar.gz
  ```

  Bundles htpasswd and audit plugins.

  ### Breaking Change

  It does not allow anymore the `auth` and `middleware` property at config file empty,
  it will fallback to those plugins by default.

## 10.0.0-alpha.3

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr

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
