# @verdaccio/utils

## 6.0.0-6-next.28

### Patch Changes

- @verdaccio/core@6.0.0-6-next.60

## 6.0.0-6-next.27

### Patch Changes

- @verdaccio/core@6.0.0-6-next.59

## 6.0.0-6-next.26

### Patch Changes

- @verdaccio/core@6.0.0-6-next.58

## 6.0.0-6-next.25

### Patch Changes

- @verdaccio/core@6.0.0-6-next.57

## 6.0.0-6-next.24

### Minor Changes

- a1986e09: feat: expose middleware utils

### Patch Changes

- @verdaccio/core@6.0.0-6-next.56

## 6.0.0-6-next.23

### Patch Changes

- 9718e033: fix: build targets for 5x modules
- Updated dependencies [9718e033]
  - @verdaccio/core@6.0.0-6-next.55

## 6.0.0-6-next.22

### Minor Changes

- ef88da3b: feat: improve support for fs promises older nodejs

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/core@6.0.0-6-next.54

## 6.0.0-6-next.21

### Patch Changes

- @verdaccio/core@6.0.0-6-next.53

## 6.0.0-6-next.20

### Patch Changes

- @verdaccio/core@6.0.0-6-next.52

## 6.0.0-6-next.19

### Patch Changes

- Updated dependencies [4b29d715]
  - @verdaccio/core@6.0.0-6-next.51

## 6.0.0-6-next.18

### Patch Changes

- @verdaccio/core@6.0.0-6-next.50

## 6.0.0-6-next.17

### Patch Changes

- @verdaccio/core@6.0.0-6-next.49

## 6.0.0-6-next.16

### Minor Changes

- 62c24b63: feat: add passwordValidationRegex property

### Patch Changes

- Updated dependencies [43f32687]
- Updated dependencies [62c24b63]
  - @verdaccio/core@6.0.0-6-next.48

## 6.0.0-6-next.15

### Patch Changes

- @verdaccio/core@6.0.0-6-next.47

## 6.0.0-6-next.14

### Patch Changes

- Updated dependencies [b849128d]
  - @verdaccio/core@6.0.0-6-next.8

## 6.0.0-6-next.13

### Patch Changes

- Updated dependencies [351aeeaa]
  - @verdaccio/core@6.0.0-6-next.7

## 6.0.0-6-next.12

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

### Patch Changes

- Updated dependencies [292c0a37]
- Updated dependencies [a3a209b5]
- Updated dependencies [00d1d2a1]
  - @verdaccio/core@6.0.0-6-next.6

## 6.0.0-6-next.11

### Patch Changes

- Updated dependencies [82cb0f2b]
- Updated dependencies [5167bb52]
  - @verdaccio/core@6.0.0-6-next.5

## 6.0.0-6-next.10

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

- Updated dependencies [24b9be02]
  - @verdaccio/core@6.0.0-6-next.4

## 6.0.0-6-next.9

### Minor Changes

- f86c31ed: feat: migrate web sidebar endpoint to fastify

  reuse utils methods between packages

## 6.0.0-6-next.8

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3

## 6.0.0-6-next.7

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [794af76c]
- Updated dependencies [154b2ecd]
  - @verdaccio/core@6.0.0-6-next.2

## 6.0.0-6-next.6

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
  - @verdaccio/commons-api@11.0.0-6-next.4

## 6.0.0-6-next.5

### Patch Changes

- d2c65da9: Fixed the validation of the name when searching for a tarball that have scoped package name

## 6.0.0-6-next.4

### Patch Changes

- 648575aa: Bug Fixes

  - fix escaped slash in namespaced packages

  #### Related tickets

  https://github.com/verdaccio/verdaccio/pull/2193

## 5.0.0-alpha.3

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/commons-api@10.0.0-alpha.3

## 5.0.0-alpha.2

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
  - @verdaccio/commons-api@10.0.0-alpha.2

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
- Updated dependencies [da1ee9c8]
- Updated dependencies [26b494cb]
- Updated dependencies [b57b4338]
- Updated dependencies [31af0164]
  - @verdaccio/commons-api@10.0.0-alpha.1

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
- Updated dependencies [da1ee9c82]
- Updated dependencies [26b494cbd]
- Updated dependencies [b57b43388]
- Updated dependencies [31af01641]
  - @verdaccio/commons-api@10.0.0-alpha.0
