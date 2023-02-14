# @verdaccio/config

## 6.0.0-6-next.61

### Minor Changes

- d167f92e: chore: rollback yaml dep support old nodejs versions

### Patch Changes

- @verdaccio/core@6.0.0-6-next.61
- @verdaccio/utils@6.0.0-6-next.29

## 6.0.0-6-next.60

### Minor Changes

- 45c03819: refactor: render html middleware

### Patch Changes

- @verdaccio/core@6.0.0-6-next.60
- @verdaccio/utils@6.0.0-6-next.28

## 6.0.0-6-next.59

### Patch Changes

- @verdaccio/core@6.0.0-6-next.59
- @verdaccio/utils@6.0.0-6-next.27

## 6.0.0-6-next.58

### Patch Changes

- @verdaccio/core@6.0.0-6-next.58
- @verdaccio/utils@6.0.0-6-next.26

## 6.0.0-6-next.57

### Patch Changes

- @verdaccio/core@6.0.0-6-next.57
- @verdaccio/utils@6.0.0-6-next.25

## 6.0.0-6-next.56

### Patch Changes

- Updated dependencies [a1986e09]
  - @verdaccio/utils@6.0.0-6-next.24
  - @verdaccio/core@6.0.0-6-next.56

## 6.0.0-6-next.55

### Patch Changes

- 9718e033: fix: build targets for 5x modules
- Updated dependencies [9718e033]
  - @verdaccio/core@6.0.0-6-next.55
  - @verdaccio/utils@6.0.0-6-next.23

## 6.0.0-6-next.54

### Minor Changes

- ef88da3b: feat: improve support for fs promises older nodejs

### Patch Changes

- Updated dependencies [ef88da3b]
  - @verdaccio/core@6.0.0-6-next.54
  - @verdaccio/utils@6.0.0-6-next.22

## 6.0.0-6-next.53

### Patch Changes

- @verdaccio/core@6.0.0-6-next.53
- @verdaccio/utils@6.0.0-6-next.21

## 6.0.0-6-next.52

### Patch Changes

- @verdaccio/core@6.0.0-6-next.52
- @verdaccio/utils@6.0.0-6-next.20

## 6.0.0-6-next.51

### Minor Changes

- 4b29d715: chore: move improvements from v5 to v6

  Migrate improvements form v5 to v6:

  - https://github.com/verdaccio/verdaccio/pull/3158
  - https://github.com/verdaccio/verdaccio/pull/3151
  - https://github.com/verdaccio/verdaccio/pull/2271
  - https://github.com/verdaccio/verdaccio/pull/2787
  - https://github.com/verdaccio/verdaccio/pull/2791
  - https://github.com/verdaccio/verdaccio/pull/2205

### Patch Changes

- Updated dependencies [4b29d715]
  - @verdaccio/core@6.0.0-6-next.51
  - @verdaccio/utils@6.0.0-6-next.19

## 6.0.0-6-next.50

### Patch Changes

- @verdaccio/core@6.0.0-6-next.50
- @verdaccio/utils@6.0.0-6-next.18

## 6.0.0-6-next.49

### Patch Changes

- @verdaccio/core@6.0.0-6-next.49
- @verdaccio/utils@6.0.0-6-next.17

## 6.0.0-6-next.48

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

### Minor Changes

- 62c24b63: feat: add passwordValidationRegex property

### Patch Changes

- Updated dependencies [43f32687]
- Updated dependencies [62c24b63]
  - @verdaccio/core@6.0.0-6-next.48
  - @verdaccio/utils@6.0.0-6-next.16

## 6.0.0-6-next.47

### Patch Changes

- @verdaccio/core@6.0.0-6-next.47
- @verdaccio/utils@6.0.0-6-next.15

## 6.0.0-6-next.17

### Patch Changes

- Updated dependencies [b849128d]
  - @verdaccio/core@6.0.0-6-next.8
  - @verdaccio/utils@6.0.0-6-next.14

## 6.0.0-6-next.16

### Patch Changes

- Updated dependencies [351aeeaa]
  - @verdaccio/core@6.0.0-6-next.7
  - @verdaccio/utils@6.0.0-6-next.13

## 6.0.0-6-next.15

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
  - @verdaccio/utils@6.0.0-6-next.12

## 6.0.0-6-next.14

### Minor Changes

- d43894e8: feat: rework web header for mobile, add new settings and raw manifest button

  ### New set of variables to hide features

  Add set of new variables that allow hide different parts of the UI, buttons, footer or download tarballs. _All are
  enabled by default_.

  ```yaml
  # login: true <-- already exist but worth the reminder
  # showInfo: true
  # showSettings: true
  # In combination with darkMode you can force specific theme
  # showThemeSwitch: true
  # showFooter: true
  # showSearch: true
  # showDownloadTarball: true
  ```

  > If you disable `showThemeSwitch` and force `darkMode: true` the local storage settings would be
  > ignored and force all themes to the one in the configuration file.

  Future could be extended to

  ### Raw button to display manifest package

  A new experimental feature (enabled by default), button named RAW to be able navigate on the package manifest directly on the ui, kudos to [react-json-view](https://www.npmjs.com/package/react-json-view) that allows an easy integration, not configurable yet until get more feedback.

  ```yaml
  showRaw: true
  ```

  #### Rework header buttons

  - The header has been rework, the mobile was not looking broken.
  - Removed info button in the header and moved to a dialog
  - Info dialog now contains more information about the project, license and the aid content for Ukrania now is inside of the info modal.
  - Separate settings and info to avoid collapse too much info (for mobile still need some work)

- d08fe29d: feat(web): add a config item to web，let the developer can select whet……her enable the html cache

### Patch Changes

- @verdaccio/core@6.0.0-6-next.5

## 6.0.0-6-next.13

### Major Changes

- 82cb0f2b: feat!: config.logs throw an error, logging config not longer accept array or logs property

  ### 💥 Breaking change

  This is valid

  ```yaml
  log: { type: stdout, format: pretty, level: http }
  ```

  This is invalid

  ```yaml
  logs: { type: stdout, format: pretty, level: http }
  ```

  or

  ```yaml
  logs:
    - [{ type: stdout, format: pretty, level: http }]
  ```

### Minor Changes

- 5167bb52: feat: ui search support for remote, local and private packages

  The command `npm search` search globally and return all matches, with this improvement the user interface
  is powered with the same capabilities.

  The UI also tag where is the origin the package with a tag, also provide the latest version and description of the package.

### Patch Changes

- Updated dependencies [82cb0f2b]
- Updated dependencies [5167bb52]
  - @verdaccio/core@6.0.0-6-next.5
  - @verdaccio/utils@6.0.0-6-next.11

## 6.0.0-6-next.12

### Patch Changes

- Updated dependencies [a828271d]
- Updated dependencies [24b9be02]
- Updated dependencies [b13a3fef]
  - @verdaccio/utils@6.0.0-6-next.10
  - @verdaccio/core@6.0.0-6-next.4

## 6.0.0-6-next.11

### Patch Changes

- Updated dependencies [f86c31ed]
  - @verdaccio/utils@6.0.0-6-next.9

## 6.0.0-6-next.10

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3
  - @verdaccio/utils@6.0.0-6-next.8

## 6.0.0-6-next.9

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [794af76c]
- Updated dependencies [154b2ecd]
  - @verdaccio/core@6.0.0-6-next.2
  - @verdaccio/utils@6.0.0-6-next.7

## 6.0.0-6-next.8

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
  - @verdaccio/utils@6.0.0-6-next.6

## 6.0.0-6-next.7

### Patch Changes

- Updated dependencies [d2c65da9]
  - @verdaccio/utils@6.0.0-6-next.5

## 6.0.0-6-next.6

### Minor Changes

- 1b217fd3: Some verdaccio modules depend on 'mkdirp' library which provides recursive directory creation functionality.
  NodeJS can do this out of the box since v.10.12. The last commit in 'mkdirp' was made in early 2016, and it's mid 2021 now.
  Time to stick with a built-in library solution!

  - All 'mkdirp' calls are replaced with appropriate 'fs' calls.

## 6.0.0-6-next.5

### Patch Changes

- 1810ed0d: Feature

  - add option to set storage from environment variable VERDACCIO_STORAGE_PATH

  #### Related tickets

  https://github.com/verdaccio/verdaccio/issues/1681

- Updated dependencies [648575aa]
  - @verdaccio/utils@6.0.0-6-next.4

## 6.0.0-6-next.4

### Major Changes

- 5c5057fc: feat: node api new structure based on promise

  ```js
  import { runServer } from '@verdaccio/node-api';
  // or
  import { runServer } from 'verdaccio';

  const app = await runServer(); // default configuration
  const app = await runServer('./config/config.yaml');
  const app = await runServer({ configuration });
  app.listen(4000, event => {
    // do something
  });
  ```

  ### Breaking Change

  If you are using the node-api, the new structure is Promise based and less arguments.

## 5.0.0-alpha.3

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/commons-api@10.0.0-alpha.3
  - @verdaccio/utils@5.0.0-alpha.3

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
  - @verdaccio/utils@5.0.0-alpha.2

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
  - @verdaccio/utils@5.0.0-alpha.1
