# @verdaccio/server

## 6.0.0-6-next.19

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

### Patch Changes

- Updated dependencies [459b6fa7]
  - @verdaccio/api@6.0.0-6-next.14
  - @verdaccio/auth@6.0.0-6-next.11
  - @verdaccio/config@6.0.0-6-next.8
  - @verdaccio/commons-api@11.0.0-6-next.4
  - verdaccio-audit@11.0.0-6-next.6
  - @verdaccio/store@6.0.0-6-next.12
  - @verdaccio/utils@6.0.0-6-next.6
  - @verdaccio/web@6.0.0-6-next.17
  - @verdaccio/middleware@6.0.0-6-next.11
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4

## 6.0.0-6-next.18

### Patch Changes

- @verdaccio/auth@6.0.0-6-next.10
- @verdaccio/store@6.0.0-6-next.11
- @verdaccio/api@6.0.0-6-next.13
- @verdaccio/loaders@6.0.0-6-next.4
- @verdaccio/middleware@6.0.0-6-next.10
- @verdaccio/web@6.0.0-6-next.16

## 6.0.0-6-next.17

### Patch Changes

- Updated dependencies [f96b147e]
  - verdaccio-audit@11.0.0-6-next.5
  - @verdaccio/api@6.0.0-6-next.12

## 6.0.0-6-next.16

### Patch Changes

- Updated dependencies [d2c65da9]
  - @verdaccio/utils@6.0.0-6-next.5
  - @verdaccio/api@6.0.0-6-next.12
  - @verdaccio/auth@6.0.0-6-next.9
  - @verdaccio/config@6.0.0-6-next.7
  - @verdaccio/middleware@6.0.0-6-next.9
  - @verdaccio/store@6.0.0-6-next.10
  - @verdaccio/web@6.0.0-6-next.15
  - @verdaccio/loaders@6.0.0-6-next.4

## 6.0.0-6-next.15

### Patch Changes

- Updated dependencies [5ddfa526]
  - @verdaccio/store@6.0.0-6-next.9
  - @verdaccio/web@6.0.0-6-next.14
  - @verdaccio/api@6.0.0-6-next.11

## 6.0.0-6-next.14

### Patch Changes

- Updated dependencies [0da7031e]
  - @verdaccio/web@6.0.0-6-next.13
  - @verdaccio/api@6.0.0-6-next.10
  - @verdaccio/auth@6.0.0-6-next.8
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4
  - verdaccio-audit@11.0.0-alpha.4
  - @verdaccio/store@6.0.0-6-next.8

## 6.0.0-6-next.13

### Patch Changes

- Updated dependencies [aecbd226]
  - @verdaccio/web@6.0.0-6-next.12
  - @verdaccio/api@6.0.0-6-next.10
  - @verdaccio/auth@6.0.0-6-next.8
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4
  - verdaccio-audit@11.0.0-alpha.4
  - @verdaccio/store@6.0.0-6-next.8

## 6.0.0-6-next.12

### Patch Changes

- Updated dependencies [1b217fd3]
  - @verdaccio/config@6.0.0-6-next.6
  - @verdaccio/api@6.0.0-6-next.10
  - @verdaccio/auth@6.0.0-6-next.8
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.8
  - @verdaccio/web@6.0.0-6-next.11
  - @verdaccio/middleware@6.0.0-6-next.8

## 6.0.0-6-next.11

### Patch Changes

- 19d272d1: fix: restore logger on init

  Enable logger after parse configuration and log the very first step on startup phase.

  ```bash
   warn --- experiments are enabled, it is recommended do not use experiments in production comment out this section to disable it
   info --- support for experiment [token]  is disabled
   info --- support for experiment [search]  is disabled
  (node:50831) Warning: config.logs is deprecated, rename configuration to "config.log"
  (Use `node --trace-warnings ...` to show where the warning was created)
   info --- http address http://localhost:4873/
   info --- version: 6.0.0-6-next.11
   info --- server started
  ```

  - @verdaccio/api@6.0.0-6-next.9
  - @verdaccio/auth@6.0.0-6-next.7
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4
  - verdaccio-audit@11.0.0-alpha.4
  - @verdaccio/store@6.0.0-6-next.7
  - @verdaccio/web@6.0.0-6-next.10

## 6.0.0-6-next.10

### Patch Changes

- 648575aa: Bug Fixes

  - fix escaped slash in namespaced packages

  #### Related tickets

  https://github.com/verdaccio/verdaccio/pull/2193

- Updated dependencies [1810ed0d]
- Updated dependencies [648575aa]
  - @verdaccio/config@6.0.0-6-next.5
  - @verdaccio/utils@6.0.0-6-next.4
  - @verdaccio/api@6.0.0-6-next.9
  - @verdaccio/auth@6.0.0-6-next.7
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.7
  - @verdaccio/web@6.0.0-6-next.10
  - @verdaccio/middleware@6.0.0-6-next.7

## 6.0.0-6-next.9

### Patch Changes

- Updated dependencies [5c5057fc]
  - @verdaccio/config@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4
  - @verdaccio/api@6.0.0-6-next.8
  - @verdaccio/auth@6.0.0-6-next.6
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.6
  - @verdaccio/web@6.0.0-6-next.9
  - verdaccio-audit@11.0.0-alpha.4
  - @verdaccio/middleware@6.0.0-6-next.6

## 6.0.0-6-next.8

### Patch Changes

- Updated dependencies [cb2281a5]
  - @verdaccio/store@6.0.0-6-next.5
  - @verdaccio/web@6.0.0-6-next.8
  - @verdaccio/api@6.0.0-6-next.7

## 5.0.0-alpha.7

### Patch Changes

- Updated dependencies [e0b7c4ff]
  - @verdaccio/web@5.0.0-alpha.7
  - @verdaccio/api@5.0.0-alpha.6

## 5.0.0-alpha.6

### Patch Changes

- @verdaccio/auth@5.0.0-alpha.5
- @verdaccio/api@5.0.0-alpha.6
- @verdaccio/middleware@5.0.0-alpha.5
- @verdaccio/web@5.0.0-alpha.6

## 5.0.0-alpha.5

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

### Patch Changes

- Updated dependencies [f8a50baa]
  - @verdaccio/auth@5.0.0-alpha.4
  - verdaccio-audit@10.0.0-alpha.4
  - @verdaccio/api@5.0.0-alpha.5
  - @verdaccio/middleware@5.0.0-alpha.4
  - @verdaccio/web@5.0.0-alpha.5

## 5.0.0-alpha.4

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/api@5.0.0-alpha.4
  - @verdaccio/auth@5.0.0-alpha.3
  - @verdaccio/config@5.0.0-alpha.3
  - @verdaccio/commons-api@10.0.0-alpha.3
  - @verdaccio/loaders@5.0.0-alpha.3
  - @verdaccio/logger@5.0.0-alpha.3
  - @verdaccio/middleware@5.0.0-alpha.3
  - @verdaccio/store@5.0.0-alpha.4
  - @verdaccio/utils@5.0.0-alpha.3
  - @verdaccio/web@5.0.0-alpha.4

## 5.0.0-alpha.3

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

### Patch Changes

- Updated dependencies [54c58d1e]
  - @verdaccio/api@5.0.0-alpha.3
  - @verdaccio/auth@5.0.0-alpha.2
  - @verdaccio/config@5.0.0-alpha.2
  - @verdaccio/commons-api@10.0.0-alpha.2
  - @verdaccio/loaders@5.0.0-alpha.2
  - @verdaccio/logger@5.0.0-alpha.2
  - @verdaccio/middleware@5.0.0-alpha.2
  - @verdaccio/store@5.0.0-alpha.3
  - @verdaccio/utils@5.0.0-alpha.2
  - @verdaccio/web@5.0.0-alpha.3

## 5.0.0-alpha.2

### Patch Changes

- Updated dependencies [2a327c4b]
  - @verdaccio/api@5.0.0-alpha.2
  - @verdaccio/store@5.0.0-alpha.2
  - @verdaccio/web@5.0.0-alpha.2

## 5.0.0-alpha.1

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

- Updated dependencies [d87fa026]
- Updated dependencies [42024c34]
- Updated dependencies [da1ee9c8]
- Updated dependencies [26b494cb]
- Updated dependencies [b57b4338]
- Updated dependencies [42dfed78]
- Updated dependencies [add778d5]
- Updated dependencies [31af0164]
  - @verdaccio/api@5.0.0-alpha.1
  - @verdaccio/auth@5.0.0-alpha.1
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.1
  - @verdaccio/loaders@5.0.0-alpha.1
  - @verdaccio/logger@5.0.0-alpha.1
  - @verdaccio/middleware@5.0.0-alpha.1
  - @verdaccio/store@5.0.0-alpha.1
  - @verdaccio/utils@5.0.0-alpha.1
  - @verdaccio/web@5.0.0-alpha.1

## 5.0.0-alpha.1

### Major Changes

- d87fa0268: feat!: experiments config renamed to flags

  - The `experiments` configuration is renamed to `flags`. The functionality is exactly the same.

  ```js
  flags: token: false;
  search: false;
  ```

  - The `self_path` property from the config file is being removed in favor of `config_file` full path.
  - Refactor `config` module, better types and utilities

- da1ee9c82: - Replace signature handler for legacy tokens by removing deprecated crypto.createDecipher by createCipheriv

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

- 26b494cbd: feat: add typescript project references settings

  Reading https://ebaytech.berlin/optimizing-multi-package-apps-with-typescript-project-references-d5c57a3b4440 I realized I can use project references to solve the issue to pre-compile modules on develop mode.

  It allows to navigate (IDE) trough the packages without need compile the packages.

  Add two `tsconfig`, one using the previous existing configuration that is able to produce declaration files (`tsconfig.build`) and a new one `tsconfig` which is enables [_projects references_](https://www.typescriptlang.org/docs/handbook/project-references.html).

### Patch Changes

- b57b43388: Enable prerelease mode with **changesets**
- 31af01641: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

- Updated dependencies [d87fa0268]
- Updated dependencies [42024c346]
- Updated dependencies [da1ee9c82]
- Updated dependencies [26b494cbd]
- Updated dependencies [b57b43388]
- Updated dependencies [42dfed785]
- Updated dependencies [add778d55]
- Updated dependencies [31af01641]
  - @verdaccio/api@5.0.0-alpha.1
  - @verdaccio/auth@5.0.0-alpha.1
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.0
  - @verdaccio/loaders@5.0.0-alpha.1
  - @verdaccio/logger@5.0.0-alpha.1
  - @verdaccio/middleware@5.0.0-alpha.1
  - @verdaccio/store@5.0.0-alpha.1
  - @verdaccio/utils@5.0.0-alpha.1
  - @verdaccio/web@5.0.0-alpha.1
