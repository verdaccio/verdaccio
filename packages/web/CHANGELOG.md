# @verdaccio/web

## 6.0.0-6-next.24

### Patch Changes

- Updated dependencies [b78f3525]
  - @verdaccio/logger@6.0.0-6-next.10
  - @verdaccio/auth@6.0.0-6-next.18
  - @verdaccio/loaders@6.0.0-6-next.10
  - @verdaccio/middleware@6.0.0-6-next.18
  - @verdaccio/store@6.0.0-6-next.19

## 6.0.0-6-next.23

### Minor Changes

- 048ac95e: feat: align with v5 ui endpoints and ui small bugfix

### Patch Changes

- Updated dependencies [730b5d8c]
  - @verdaccio/logger@6.0.0-6-next.9
  - @verdaccio/auth@6.0.0-6-next.17
  - @verdaccio/loaders@6.0.0-6-next.9
  - @verdaccio/middleware@6.0.0-6-next.17
  - @verdaccio/store@6.0.0-6-next.18

## 6.0.0-6-next.22

### Major Changes

- 000d4374: feat: upgrade to material ui 5

### Minor Changes

- 24b9be02: refactor: improve docker image build with strict dependencies and prod build

### Patch Changes

- Updated dependencies [a828271d]
- Updated dependencies [24b9be02]
- Updated dependencies [e75c0a3b]
- Updated dependencies [b13a3fef]
  - @verdaccio/tarball@11.0.0-6-next.11
  - @verdaccio/store@6.0.0-6-next.17
  - @verdaccio/utils@6.0.0-6-next.10
  - @verdaccio/core@6.0.0-6-next.4
  - @verdaccio/middleware@6.0.0-6-next.16
  - @verdaccio/logger@6.0.0-6-next.8
  - @verdaccio/auth@6.0.0-6-next.16
  - @verdaccio/config@6.0.0-6-next.12
  - @verdaccio/url@11.0.0-6-next.8
  - @verdaccio/loaders@6.0.0-6-next.8
  - @verdaccio/readme@11.0.0-6-next.4

## 6.0.0-6-next.21

### Minor Changes

- f86c31ed: feat: migrate web sidebar endpoint to fastify

  reuse utils methods between packages

- 20c9e43e: dist tags Implementation on Fastify

### Patch Changes

- Updated dependencies [f86c31ed]
- Updated dependencies [20c9e43e]
  - @verdaccio/store@6.0.0-6-next.16
  - @verdaccio/utils@6.0.0-6-next.9
  - @verdaccio/auth@6.0.0-6-next.15
  - @verdaccio/config@6.0.0-6-next.11
  - @verdaccio/tarball@11.0.0-6-next.10
  - @verdaccio/middleware@6.0.0-6-next.15
  - @verdaccio/loaders@6.0.0-6-next.7

## 6.0.0-6-next.20

### Patch Changes

- Updated dependencies [6c1eb021]
  - @verdaccio/core@6.0.0-6-next.3
  - @verdaccio/logger@6.0.0-6-next.7
  - @verdaccio/auth@6.0.0-6-next.14
  - @verdaccio/config@6.0.0-6-next.10
  - @verdaccio/tarball@11.0.0-6-next.9
  - @verdaccio/url@11.0.0-6-next.7
  - @verdaccio/loaders@6.0.0-6-next.7
  - @verdaccio/middleware@6.0.0-6-next.14
  - @verdaccio/store@6.0.0-6-next.15
  - @verdaccio/utils@6.0.0-6-next.8

## 6.0.0-6-next.19

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

### Patch Changes

- Updated dependencies [794af76c]
- Updated dependencies [b702ea36]
- Updated dependencies [154b2ecd]
  - @verdaccio/auth@6.0.0-6-next.13
  - @verdaccio/config@6.0.0-6-next.9
  - @verdaccio/core@6.0.0-6-next.2
  - @verdaccio/readme@11.0.0-6-next.4
  - @verdaccio/tarball@11.0.0-6-next.8
  - @verdaccio/url@11.0.0-6-next.6
  - @verdaccio/loaders@6.0.0-6-next.6
  - @verdaccio/logger@6.0.0-6-next.6
  - @verdaccio/middleware@6.0.0-6-next.13
  - @verdaccio/store@6.0.0-6-next.14
  - @verdaccio/utils@6.0.0-6-next.7

## 6.0.0-6-next.18

### Patch Changes

- Updated dependencies [2c594910]
  - @verdaccio/logger@6.0.0-6-next.5
  - @verdaccio/auth@6.0.0-6-next.12
  - @verdaccio/loaders@6.0.0-6-next.5
  - @verdaccio/middleware@6.0.0-6-next.12
  - @verdaccio/store@6.0.0-6-next.13

## 6.0.0-6-next.17

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
  - @verdaccio/store@6.0.0-6-next.12
  - @verdaccio/utils@6.0.0-6-next.6
  - @verdaccio/middleware@6.0.0-6-next.11
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/tarball@11.0.0-6-next.7
  - @verdaccio/url@11.0.0-6-next.5
  - @verdaccio/readme@11.0.0-alpha.3
  - @verdaccio/logger@6.0.0-6-next.4

## 6.0.0-6-next.16

### Patch Changes

- @verdaccio/auth@6.0.0-6-next.10
- @verdaccio/store@6.0.0-6-next.11
- @verdaccio/loaders@6.0.0-6-next.4
- @verdaccio/middleware@6.0.0-6-next.10

## 6.0.0-6-next.15

### Patch Changes

- Updated dependencies [d2c65da9]
  - @verdaccio/utils@6.0.0-6-next.5
  - @verdaccio/auth@6.0.0-6-next.9
  - @verdaccio/config@6.0.0-6-next.7
  - @verdaccio/tarball@11.0.0-6-next.6
  - @verdaccio/middleware@6.0.0-6-next.9
  - @verdaccio/store@6.0.0-6-next.10
  - @verdaccio/loaders@6.0.0-6-next.4

## 6.0.0-6-next.14

### Patch Changes

- 5ddfa526: Fix the search by exact name of the package

  Full package name queries was not finding anithing. It was happening
  becouse of stemmer of [lunr.js](https://lunrjs.com/).

  To fix this, the stemmer of [lunr.js](https://lunrjs.com/) was removed from search pipeline.

- Updated dependencies [5ddfa526]
  - @verdaccio/store@6.0.0-6-next.9

## 6.0.0-6-next.13

### Minor Changes

- 0da7031e: allow disable login on ui and endpoints

  To be able disable the login, set `login: false`, anything else would enable login. This flag will disable access via UI and web endpoints.

  ```yml
  web:
    title: verdaccio
    login: false
  ```

### Patch Changes

- @verdaccio/auth@6.0.0-6-next.8
- @verdaccio/readme@11.0.0-alpha.3
- @verdaccio/tarball@11.0.0-6-next.5
- @verdaccio/url@11.0.0-6-next.4
- @verdaccio/loaders@6.0.0-6-next.4
- @verdaccio/logger@6.0.0-6-next.4
- @verdaccio/store@6.0.0-6-next.8

## 6.0.0-6-next.12

### Minor Changes

- aecbd226: web: allow ui hide package managers on sidebar

  If there is a package manager of preference over others, you can define the package managers to be displayed on the detail page and sidebar, just define in the `config.yaml` and web section the list of package managers to be displayed.

  ```
  web:
    title: Verdaccio
    sort_packages: asc
    primary_color: #cccccc
    pkgManagers:
      - pnpm
      - yarn
      # - npm
  ```

  To disable all package managers, just define empty:

  ```
  web:
    title: Verdaccio
    sort_packages: asc
    primary_color: #cccccc
    pkgManagers:
  ```

  and the section would be hidden.

### Patch Changes

- @verdaccio/auth@6.0.0-6-next.8
- @verdaccio/readme@11.0.0-alpha.3
- @verdaccio/tarball@11.0.0-6-next.5
- @verdaccio/url@11.0.0-6-next.4
- @verdaccio/loaders@6.0.0-6-next.4
- @verdaccio/logger@6.0.0-6-next.4
- @verdaccio/store@6.0.0-6-next.8

## 6.0.0-6-next.11

### Patch Changes

- Updated dependencies [1b217fd3]
  - @verdaccio/config@6.0.0-6-next.6
  - @verdaccio/auth@6.0.0-6-next.8
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.8
  - @verdaccio/middleware@6.0.0-6-next.8

## 6.0.0-6-next.10

### Patch Changes

- Updated dependencies [1810ed0d]
- Updated dependencies [648575aa]
  - @verdaccio/config@6.0.0-6-next.5
  - @verdaccio/tarball@11.0.0-6-next.5
  - @verdaccio/utils@6.0.0-6-next.4
  - @verdaccio/auth@6.0.0-6-next.7
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.7
  - @verdaccio/middleware@6.0.0-6-next.7

## 6.0.0-6-next.9

### Patch Changes

- Updated dependencies [5c5057fc]
  - @verdaccio/config@6.0.0-6-next.4
  - @verdaccio/logger@6.0.0-6-next.4
  - @verdaccio/auth@6.0.0-6-next.6
  - @verdaccio/loaders@6.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.6
  - @verdaccio/readme@11.0.0-alpha.3
  - @verdaccio/tarball@11.0.0-6-next.4
  - @verdaccio/url@11.0.0-6-next.4
  - @verdaccio/middleware@6.0.0-6-next.6

## 6.0.0-6-next.8

### Patch Changes

- Updated dependencies [cb2281a5]
  - @verdaccio/url@11.0.0-6-next.4
  - @verdaccio/store@6.0.0-6-next.5
  - @verdaccio/tarball@11.0.0-6-next.4

## 5.0.0-alpha.7

### Major Changes

- e0b7c4ff: feat: flexible user interface generator

  **breaking change**

  The UI does not provide a pre-generated `index.html`, instead the server generates
  the body of the web application based in few parameters:

  - Webpack manifest
  - User configuration details

  It allows inject html tags, javascript and new CSS to make the page even more flexible.

  ### Web new properties for dynamic template

  The new set of properties are made in order allow inject _html_ and _JavaScript_ scripts within the template. This
  might be useful for scenarios like Google Analytics scripts or custom html in any part of the body.

  - metaScripts: html injected before close the `head` element.
  - scriptsBodyAfter: html injected before close the `body` element.
  - bodyAfter: html injected after _verdaccio_ JS scripts.

  ```yaml
  web:
    scriptsBodyAfter:
      - '<script type="text/javascript" src="https://my.company.com/customJS.min.js"></script>'
    metaScripts:
      - '<script type="text/javascript" src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>'
      - '<script type="text/javascript" src="https://browser.sentry-cdn.com/5.15.5/bundle.min.js"></script>'
      - '<meta name="robots" content="noindex" />'
    bodyBefore:
      - '<div id="myId">html before webpack scripts</div>'
    bodyAfter:
      - '<div id="myId">html after webpack scripts</div>'
  ```

  ### UI plugin changes

  - `index.html` is not longer used, template is generated based on `manifest.json` generated by webpack.
  - Plugin must export:
    - the manifest file.
    - the manifest files: matcher (array of id that generates required scripts to run the ui)
    - static path: The absolute path where the files are located in `node_modules`

  ```
  exports.staticPath = path.join(__dirname, 'static');
  exports.manifest = require('./static/manifest.json');
  exports.manifestFiles = {
    js: ['runtime.js', 'vendors.js', 'main.js'],
    css: [],
    ico: 'favicon.ico',
  };
  ```

  - Remove font files
  - CSS is inline on JS (this will help with #2046)

  ### Docker v5 Examples

  - Move all current examples to v4 folder
  - Remove any v3 example
  - Create v5 folder with Nginx Example

  #### Related tickets

  https://github.com/verdaccio/verdaccio/issues/1523
  https://github.com/verdaccio/verdaccio/issues/1297
  https://github.com/verdaccio/verdaccio/issues/1593
  https://github.com/verdaccio/verdaccio/discussions/1539
  https://github.com/verdaccio/website/issues/264
  https://github.com/verdaccio/verdaccio/issues/1565
  https://github.com/verdaccio/verdaccio/issues/1251
  https://github.com/verdaccio/verdaccio/issues/2029
  https://github.com/verdaccio/docker-examples/issues/29

## 5.0.0-alpha.6

### Patch Changes

- @verdaccio/auth@5.0.0-alpha.5
- @verdaccio/middleware@5.0.0-alpha.5

## 5.0.0-alpha.5

### Patch Changes

- Updated dependencies [f8a50baa]
  - @verdaccio/auth@5.0.0-alpha.4
  - @verdaccio/middleware@5.0.0-alpha.4

## 5.0.0-alpha.4

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr
- Updated dependencies [fecbb9be]
  - @verdaccio/auth@5.0.0-alpha.3
  - @verdaccio/config@5.0.0-alpha.3
  - @verdaccio/commons-api@10.0.0-alpha.3
  - @verdaccio/readme@10.0.0-alpha.3
  - @verdaccio/loaders@5.0.0-alpha.3
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
  - @verdaccio/readme@10.0.0-alpha.2
  - @verdaccio/loaders@5.0.0-alpha.2
  - @verdaccio/logger@5.0.0-alpha.2
  - @verdaccio/middleware@5.0.0-alpha.2
  - @verdaccio/store@5.0.0-alpha.3
  - @verdaccio/utils@5.0.0-alpha.2

## 5.0.0-alpha.2

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

- 42024c34: Remove @ts-ignore and any in packages/web/src/endpoint/package.ts
- b57b4338: Enable prerelease mode with **changesets**
- Updated dependencies [d87fa026]
- Updated dependencies [42024c34]
- Updated dependencies [da1ee9c8]
- Updated dependencies [26b494cb]
- Updated dependencies [b57b4338]
- Updated dependencies [add778d5]
- Updated dependencies [31af0164]
  - @verdaccio/auth@5.0.0-alpha.1
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.1
  - @verdaccio/readme@10.0.0-alpha.1
  - @verdaccio/loaders@5.0.0-alpha.1
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

- 42024c346: Remove @ts-ignore and any in packages/web/src/endpoint/package.ts
- b57b43388: Enable prerelease mode with **changesets**
- Updated dependencies [d87fa0268]
- Updated dependencies [42024c346]
- Updated dependencies [da1ee9c82]
- Updated dependencies [26b494cbd]
- Updated dependencies [b57b43388]
- Updated dependencies [add778d55]
- Updated dependencies [31af01641]
  - @verdaccio/auth@5.0.0-alpha.1
  - @verdaccio/config@5.0.0-alpha.1
  - @verdaccio/commons-api@10.0.0-alpha.0
  - @verdaccio/readme@10.0.0-alpha.0
  - @verdaccio/loaders@5.0.0-alpha.1
  - @verdaccio/logger@5.0.0-alpha.1
  - @verdaccio/middleware@5.0.0-alpha.1
  - @verdaccio/store@5.0.0-alpha.1
  - @verdaccio/utils@5.0.0-alpha.1
