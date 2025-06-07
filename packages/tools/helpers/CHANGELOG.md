# Change Log

## 4.0.0-next-8.5

### Patch Changes

- 72c3cbb: chore(utils): replace @verdaccio/utils dependency with core

## 4.0.0-next-8.4

### Patch Changes

- e4a1539: chore: package.json maintenance
- 0607e80: chore: update readme badges and license files

## 4.0.0-next-8.3

### Patch Changes

- 139861e: fix: crashes with path-to-regexp v0.1.12 express

## 4.0.0-next-8.2

### Patch Changes

- a049bba: chore(tests): temp folder naming

## 4.0.0-next-8.1

### Patch Changes

- e93d6a3: chore: auth package requires logger as parameter

## 4.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

## 3.0.0

### Major Changes

- 47f61c6: feat!: bump to v7

### Minor Changes

- f047cc8: refactor: auth with legacy sign support

### Patch Changes

- c807f0c: fix: store readme when publishing locally

## 3.0.0-next-7.2

### Patch Changes

- c807f0c: fix: store readme when publishing locally

## 3.0.0-next.1

### Minor Changes

- f047cc8: refactor: auth with legacy sign support

## 3.0.0-next.0

### Major Changes

- feat!: bump to v7

## 2.0.0

### Major Changes

- 9fc2e7961: feat(plugins): improve plugin loader

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

### Minor Changes

- dc571aabd: feat: add forceEnhancedLegacySignature
- ce013d2fc: refactor: npm star command support reimplemented
- 5167bb528: feat: ui search support for remote, local and private packages

  The command `npm search` search globally and return all matches, with this improvement the user interface
  is powered with the same capabilities.

  The UI also tag where is the origin the package with a tag, also provide the latest version and description of the package.

- 37274e4c8: feat: implement abbreviated manifest

  Enable abbreviated manifest data by adding the header:

  ```
  curl -H "Accept: application/vnd.npm.install-v1+json" https://registry.npmjs.org/verdaccio
  ```

  It returns a filtered manifest, additionally includes the [time](https://github.com/pnpm/rfcs/pull/2) field by request.

  Current support for packages managers:

  - npm: yes
  - pnpm: yes
  - yarn classic: yes
  - yarn modern (+2.x): [no](https://github.com/yarnpkg/berry/pull/3981#issuecomment-1076566096)

  https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format

### Patch Changes

- 9943e2b18: fix: extract logger from middleware
- 351aeeaa8: fix(deps): @verdaccio/utils should be a prod dep of local-storage
- a828a5f6c: fix: #3174 set correctly ui values to html render
- b849128de: fix: handle upload scoped tarball

## 2.0.0-6-next.8

### Minor Changes

- dc571aab: feat: add forceEnhancedLegacySignature

## 2.0.0-6-next.7

### Patch Changes

- 9943e2b1: fix: extract logger from middleware

## 2.0.0-6-next.6

### Minor Changes

- ce013d2f: refactor: npm star command support reimplemented

## 2.0.0-6-next.5

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

## 1.1.0-6-next.4

### Patch Changes

- b849128d: fix: handle upload scoped tarball

## 1.1.0-6-next.3

### Patch Changes

- 351aeeaa: fix(deps): @verdaccio/utils should be a prod dep of local-storage

## 1.1.0-6-next.2

### Minor Changes

- 37274e4c: feat: implement abbreviated manifest

  Enable abbreviated manifest data by adding the header:

  ```
  curl -H "Accept: application/vnd.npm.install-v1+json" https://registry.npmjs.org/verdaccio
  ```

  It returns a filtered manifest, additionally includes the [time](https://github.com/pnpm/rfcs/pull/2) field by request.

  Current support for packages managers:

  - npm: yes
  - pnpm: yes
  - yarn classic: yes
  - yarn modern (+2.x): [no](https://github.com/yarnpkg/berry/pull/3981#issuecomment-1076566096)

  https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md#abbreviated-metadata-format

## 1.1.0-6-next.1

### Patch Changes

- a828a5f6: fix: #3174 set correctly ui values to html render

## 1.1.0-6-next.0

### Minor Changes

- 5167bb52: feat: ui search support for remote, local and private packages

  The command `npm search` search globally and return all matches, with this improvement the user interface
  is powered with the same capabilities.

  The UI also tag where is the origin the package with a tag, also provide the latest version and description of the package.

## 11.0.0-6-next.4

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

- da1ee9c8: - Replace signature handler for legacy tokens by removing deprecated crypto.createDecipher by createCipheriv

  - Introduce environment variables for legacy tokens

  ### Code Improvements

  - Add debug library for improve developer experience

  ### Breaking change

  - The new signature invalidates all previous tokens generated by Verdaccio 4 or previous versions.
  - The secret key must have 32 characters long.

  ### New environment variables

  - `VERDACCIO_LEGACY_ALGORITHM`: Allows to define the specific algorithm for the token signature which by default is `aes-256-ctr`
  - `VERDACCIO_LEGACY_ENCRYPTION_KEY`: By default, the token stores in the database, but using this variable allows to get it from memory

### Minor Changes

- 26b494cb: feat: add typescript project references settings

  Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.

  It allows to navigate (IDE) trough the packages without need compile the packages.

  Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

### Patch Changes

- b57b4338: Enable prerelease mode with **changesets**
- 31af0164: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [9.7.1](https://github.com/verdaccio/monorepo/compare/v9.7.0...v9.7.1) (2020-07-10)

### Bug Fixes

- update dependencies ([#375](https://github.com/verdaccio/monorepo/issues/375)) ([1e7aeec](https://github.com/verdaccio/monorepo/commit/1e7aeec31b056979285e272793a95b8c75d57c77))

## [9.6.1](https://github.com/verdaccio/monorepo/compare/v9.6.0...v9.6.1) (2020-06-07)

**Note:** Version bump only for package @verdaccio/commons-api

# [9.4.0](https://github.com/verdaccio/monorepo/compare/v9.3.4...v9.4.0) (2020-03-21)

**Note:** Version bump only for package @verdaccio/commons-api

## [9.3.2](https://github.com/verdaccio/monorepo/compare/v9.3.1...v9.3.2) (2020-03-08)

**Note:** Version bump only for package @verdaccio/commons-api

## [9.3.1](https://github.com/verdaccio/monorepo/compare/v9.3.0...v9.3.1) (2020-02-23)

**Note:** Version bump only for package @verdaccio/commons-api

# [9.0.0](https://github.com/verdaccio/monorepo/compare/v8.5.3...v9.0.0) (2020-01-07)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.5.0](https://github.com/verdaccio/monorepo/compare/v8.4.2...v8.5.0) (2019-12-22)

**Note:** Version bump only for package @verdaccio/commons-api

## [8.4.2](https://github.com/verdaccio/monorepo/compare/v8.4.1...v8.4.2) (2019-11-23)

**Note:** Version bump only for package @verdaccio/commons-api

## [8.4.1](https://github.com/verdaccio/monorepo/compare/v8.4.0...v8.4.1) (2019-11-22)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.4.0](https://github.com/verdaccio/monorepo/compare/v8.3.0...v8.4.0) (2019-11-22)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.3.0](https://github.com/verdaccio/monorepo/compare/v8.2.0...v8.3.0) (2019-10-27)

### Features

- add http-status-codes dep ([#212](https://github.com/verdaccio/monorepo/issues/212)) ([00b66af](https://github.com/verdaccio/monorepo/commit/00b66af))

# [8.2.0](https://github.com/verdaccio/monorepo/compare/v8.2.0-next.0...v8.2.0) (2019-10-23)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.2.0-next.0](https://github.com/verdaccio/monorepo/compare/v8.1.4...v8.2.0-next.0) (2019-10-08)

### Bug Fixes

- fixed lint errors ([5e677f7](https://github.com/verdaccio/monorepo/commit/5e677f7))
- fixed lint errors ([c80e915](https://github.com/verdaccio/monorepo/commit/c80e915))
- quotes should be single ([ae9aa44](https://github.com/verdaccio/monorepo/commit/ae9aa44))

## [8.1.2](https://github.com/verdaccio/monorepo/compare/v8.1.1...v8.1.2) (2019-09-29)

**Note:** Version bump only for package @verdaccio/commons-api

## [8.1.1](https://github.com/verdaccio/monorepo/compare/v8.1.0...v8.1.1) (2019-09-26)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.1.0](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.1...v8.1.0) (2019-09-07)

**Note:** Version bump only for package @verdaccio/commons-api

## [8.0.1-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.0...v8.0.1-next.1) (2019-08-29)

**Note:** Version bump only for package @verdaccio/commons-api

## [8.0.1-next.0](https://github.com/verdaccio/monorepo/compare/v8.0.0...v8.0.1-next.0) (2019-08-29)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.0.0](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.4...v8.0.0) (2019-08-22)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.0.0-next.4](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.3...v8.0.0-next.4) (2019-08-18)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.0.0-next.2](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.1...v8.0.0-next.2) (2019-08-03)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.0.0-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.0...v8.0.0-next.1) (2019-08-01)

**Note:** Version bump only for package @verdaccio/commons-api

# [8.0.0-next.0](https://github.com/verdaccio/monorepo/compare/v2.0.0...v8.0.0-next.0) (2019-08-01)

### Features

- **commons-api:** add commons-api package ([13dfa76](https://github.com/verdaccio/monorepo/commit/13dfa76))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.2](https://github.com/verdaccio/commons-api/compare/v0.1.1...v0.1.2) (2019-07-15)

### Build System

- build before publish ([f3d952d](https://github.com/verdaccio/commons-api/commit/f3d952d))

### [0.1.1](https://github.com/verdaccio/commons-api/compare/v0.1.0...v0.1.1) (2019-07-12)

### Bug Fixes

- remove unecessary shallow copy ([af7bc7c](https://github.com/verdaccio/commons-api/commit/af7bc7c))

## 0.1.0 (2019-06-25)

### Features

- add error handler modules ([936212b](https://github.com/verdaccio/commons-api/commit/936212b))
