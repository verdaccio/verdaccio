# @verdaccio/api

## 6.0.0-6-next.21

### Patch Changes

- Updated dependencies [b78f3525]
  - @verdaccio/logger@6.0.0-6-next.10
  - @verdaccio/auth@6.0.0-6-next.18
  - @verdaccio/hooks@6.0.0-6-next.12
  - @verdaccio/middleware@6.0.0-6-next.18
  - @verdaccio/store@6.0.0-6-next.19

## 6.0.0-6-next.20

### Patch Changes

- Updated dependencies [730b5d8c]
  - @verdaccio/logger@6.0.0-6-next.9
  - @verdaccio/auth@6.0.0-6-next.17
  - @verdaccio/hooks@6.0.0-6-next.11
  - @verdaccio/middleware@6.0.0-6-next.17
  - @verdaccio/store@6.0.0-6-next.18

## 6.0.0-6-next.19

### Major Changes

- a828271d: refactor: download manifest endpoint and integrate fastify

  Much simpler API for fetching a package

  ```
   const manifest = await storage.getPackageNext({
        name,
        uplinksLook: true,
        req,
        version: queryVersion,
        requestOptions,
   });
  ```

  > not perfect, the `req` still is being passed to the proxy (this has to be refactored at proxy package) and then removed from here, in proxy we pass the request instance to the `request` library.

  ### Details

  - `async/await` sugar for getPackage()
  - Improve and reuse code between current implementation and new fastify endpoint (add scaffolding for request manifest)
  - Improve performance
  - Add new tests

  ### Breaking changes

  All storage plugins will stop to work since the storage uses `getPackageNext` method which is Promise based, I won't replace this now because will force me to update all plugins, I'll follow up in another PR. Currently will throw http 500

### Minor Changes

- 24b9be02: refactor: improve docker image build with strict dependencies and prod build
- b13a3fef: refactor: improve versions and dist-tag filters

### Patch Changes

- Updated dependencies [a828271d]
- Updated dependencies [24b9be02]
- Updated dependencies [e75c0a3b]
- Updated dependencies [b13a3fef]
  - @verdaccio/store@6.0.0-6-next.17
  - @verdaccio/utils@6.0.0-6-next.10
  - @verdaccio/core@6.0.0-6-next.4
  - @verdaccio/middleware@6.0.0-6-next.16
  - @verdaccio/logger@6.0.0-6-next.8
  - @verdaccio/auth@6.0.0-6-next.16
  - @verdaccio/config@6.0.0-6-next.12
  - @verdaccio/hooks@6.0.0-6-next.10

## 6.0.0-6-next.18

### Patch Changes

- Updated dependencies [f86c31ed]
- Updated dependencies [20c9e43e]
  - @verdaccio/store@6.0.0-6-next.16
  - @verdaccio/utils@6.0.0-6-next.9
  - @verdaccio/auth@6.0.0-6-next.15
  - @verdaccio/config@6.0.0-6-next.11
  - @verdaccio/tarball@11.0.0-6-next.10
  - @verdaccio/middleware@6.0.0-6-next.15
  - @verdaccio/hooks@6.0.0-6-next.9

## 6.0.0-6-next.17

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3
  - @verdaccio/logger@6.0.0-6-next.7
  - @verdaccio/auth@6.0.0-6-next.14
  - @verdaccio/config@6.0.0-6-next.10
  - @verdaccio/tarball@11.0.0-6-next.9
  - @verdaccio/hooks@6.0.0-6-next.9
  - @verdaccio/middleware@6.0.0-6-next.14
  - @verdaccio/store@6.0.0-6-next.15
  - @verdaccio/utils@6.0.0-6-next.8

## 6.0.0-6-next.16

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- b702ea36: abort search request support for proxy
- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [794af76c]
- Updated dependencies [b702ea36]
- Updated dependencies [154b2ecd]
  - @verdaccio/auth@6.0.0-6-next.13
  - @verdaccio/config@6.0.0-6-next.9
  - @verdaccio/core@6.0.0-6-next.2
  - @verdaccio/tarball@11.0.0-6-next.8
  - @verdaccio/hooks@6.0.0-6-next.8
  - @verdaccio/logger@6.0.0-6-next.6
  - @verdaccio/middleware@6.0.0-6-next.13
  - @verdaccio/store@6.0.0-6-next.14
  - @verdaccio/utils@6.0.0-6-next.7

## 6.0.0-6-next.15

### Patch Changes

- Updated dependencies [2c594910]
  - @verdaccio/logger@6.0.0-6-next.5
  - @verdaccio/auth@6.0.0-6-next.12
  - @verdaccio/hooks@6.0.0-6-next.7
  - @verdaccio/middleware@6.0.0-6-next.12
  - @verdaccio/store@6.0.0-6-next.13

## 6.0.0-6-next.14

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
  - @verdaccio/auth@6.0.0-6-next.11
  - @verdaccio/config@6.0.0-6-next.8
  - @verdaccio/commons-api@11.0.0-6-next.4
  - @verdaccio/core@6.0.0-6-next.1
  - @verdaccio/hooks@6.0.0-6-next.6
  - @verdaccio/store@6.0.0-6-next.12
  - @verdaccio/utils@6.0.0-6-next.6
  - @verdaccio/middleware@6.0.0-6-next.11
  - @verdaccio/tarball@11.0.0-6-next.7
  - @verdaccio/logger@6.0.0-6-next.4

## 6.0.0-6-next.13

### Patch Changes

- Updated dependencies [df0da3d6]
  - @verdaccio/hooks@6.0.0-6-next.5
  - @verdaccio/auth@6.0.0-6-next.10
  - @verdaccio/store@6.0.0-6-next.11
  - @verdaccio/middleware@6.0.0-6-next.10

## 6.0.0-6-next.12

### Patch Changes

- Updated dependencies [d2c65da9]
  - @verdaccio/utils@6.0.0-6-next.5
  - @verdaccio/auth@6.0.0-6-next.9
  - @verdaccio/config@6.0.0-6-next.7
  - @verdaccio/tarball@11.0.0-6-next.6
  - @verdaccio/middleware@6.0.0-6-next.9
  - @verdaccio/store@6.0.0-6-next.10
  - @verdaccio/hooks@6.0.0-6-next.4

## 6.0.0-6-next.11

### Patch Changes

- Updated dependencies [5ddfa526]
  - @verdaccio/store@6.0.0-6-next.9

## 6.0.0-6-next.10

### Patch Changes

- Updated dependencies [1b217fd3]
  - @verdaccio/config@6.0.0-6-next.6
  - @verdaccio/auth@6.0.0-6-next.8
  - @verdaccio/hooks@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.8
  - @verdaccio/middleware@6.0.0-6-next.8

## 6.0.0-6-next.9

### Patch Changes

- Updated dependencies [1810ed0d]
- Updated dependencies [648575aa]
  - @verdaccio/config@6.0.0-6-next.5
  - @verdaccio/tarball@11.0.0-6-next.5
  - @verdaccio/utils@6.0.0-6-next.4
  - @verdaccio/auth@6.0.0-6-next.7
  - @verdaccio/hooks@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.7
  - @verdaccio/middleware@6.0.0-6-next.7

## 6.0.0-6-next.8

### Patch Changes

- Updated dependencies [5c5057fc]
  - @verdaccio/config@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4
  - @verdaccio/auth@6.0.0-6-next.6
  - @verdaccio/hooks@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.6
  - @verdaccio/tarball@11.0.0-6-next.4
  - @verdaccio/middleware@6.0.0-6-next.6

## 6.0.0-6-next.7

### Patch Changes

- Updated dependencies [cb2281a5]
  - @verdaccio/store@6.0.0-6-next.5
  - @verdaccio/tarball@11.0.0-6-next.4

## 5.0.0-alpha.6

### Patch Changes

- @verdaccio/auth@5.0.0-alpha.5
- @verdaccio/hooks@5.0.0-alpha.3
- @verdaccio/middleware@5.0.0-alpha.5

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies [f8a50baa]
  - @verdaccio/auth@5.0.0-alpha.4
  - @verdaccio/hooks@5.0.0-alpha.3
  - @verdaccio/middleware@5.0.0-alpha.4

## 5.0.0-alpha.4

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/auth@5.0.0-alpha.3
  - @verdaccio/config@5.0.0-alpha.3
  - @verdaccio/commons-api@10.0.0-alpha.3
  - @verdaccio/hooks@5.0.0-alpha.3
  - @verdaccio/logger@5.0.0-alpha.3
  - @verdaccio/middleware@5.0.0-alpha.3
  - @verdaccio/store@5.0.0-alpha.4
  - @verdaccio/utils@5.0.0-alpha.3

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
  - @verdaccio/auth@5.0.0-alpha.2
  - @verdaccio/config@5.0.0-alpha.2
  - @verdaccio/commons-api@10.0.0-alpha.2
  - @verdaccio/hooks@5.0.0-alpha.2
  - @verdaccio/logger@5.0.0-alpha.2
  - @verdaccio/middleware@5.0.0-alpha.2
  - @verdaccio/store@5.0.0-alpha.3
  - @verdaccio/utils@5.0.0-alpha.2

## 5.0.0-alpha.2

### Minor Changes

- 2a327c4b: feat: remove level dependency by lowdb for npm token cli as storage

  ### new npm token database

  There will be a new database located in your storage named `.token-db.json` which
  will store all references to created tokens, **it does not store tokens**, just
  mask of them and related metadata required to reference them.

  #### Breaking change

  If you were relying on `npm token` experiment. This PR will replace the
  used database (level) by a json plain based one (lowbd) which does not
  require Node.js C++ compilation step and has less dependencies. Since was
  a experiment there is no migration step.

### Patch Changes

- @verdaccio/store@5.0.0-alpha.2

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
- 42dfed78: testing changesets
- 31af0164: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

- Updated dependencies [d87fa026]
- Updated dependencies [42024c34]
- Updated dependencies [da1ee9c8]
- Updated dependencies [ae52ba35]
- Updated dependencies [26b494cb]
- Updated dependencies [b57b4338]
- Updated dependencies [add778d5]
- Updated dependencies [31af0164]
  - @verdaccio/auth@5.0.0-alpha.1
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.1
  - @verdaccio/hooks@5.0.0-alpha.1
  - @verdaccio/logger@5.0.0-alpha.1
  - @verdaccio/middleware@5.0.0-alpha.1
  - @verdaccio/store@5.0.0-alpha.1
  - @verdaccio/utils@5.0.0-alpha.1

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
- 42dfed785: testing changesets
- 31af01641: ESLint Warnings Fixed

  Related to issue #1461

  - max-len: most of the sensible max-len errors are fixed
  - no-unused-vars: most of these types of errors are fixed by deleting not needed declarations
  - @typescript-eslint/no-unused-vars: same as above

- Updated dependencies [d87fa0268]
- Updated dependencies [42024c346]
- Updated dependencies [da1ee9c82]
- Updated dependencies [ae52ba352]
- Updated dependencies [26b494cbd]
- Updated dependencies [b57b43388]
- Updated dependencies [add778d55]
- Updated dependencies [31af01641]
  - @verdaccio/auth@5.0.0-alpha.1
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.0
  - @verdaccio/hooks@5.0.0-alpha.1
  - @verdaccio/logger@5.0.0-alpha.1
  - @verdaccio/middleware@5.0.0-alpha.1
  - @verdaccio/store@5.0.0-alpha.1
  - @verdaccio/utils@5.0.0-alpha.1
