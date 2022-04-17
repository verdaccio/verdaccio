# @verdaccio/ui-theme

## 6.0.0-6-next.24

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

## 6.0.0-6-next.23

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

- 5b390396: fix: fixes some style issues on mobile, particularly related to the Ukraine support message - [@s-h-a-d-o-w](https://github.com/s-h-a-d-o-w)

## 6.0.0-6-next.22

### Patch Changes

- a2b69a08: add banner support ukraine

## 6.0.0-6-next.21

### Patch Changes

- a179f1fd: show verdaccio logo in the footer even when custom brand is set

## 6.0.0-6-next.20

### Patch Changes

- 635ca3f9: chore: force publish

## 6.0.0-6-next.19

### Patch Changes

- aa0b2aa9: fix: replace ts icon by td and fix commonjs icon

## 6.0.0-6-next.18

### Patch Changes

- df53f61c: feat: add types and package module icons on sidebar

## 6.0.0-6-next.17

### Patch Changes

- c9089631: fix: specific version package detail page not showing

## 6.0.0-6-next.16

### Minor Changes

- ad3151c3: fix: remove engines from ui-theme

## 6.0.0-6-next.15

### Minor Changes

- 7ff4808b: feat: improve registry info dialog and language switch

## 6.0.0-6-next.14

### Minor Changes

- 048ac95e: feat: align with v5 ui endpoints and ui small bugfix

## 6.0.0-6-next.13

### Major Changes

- 000d4374: feat: upgrade to material ui 5

## 6.0.0-6-next.12

### Major Changes

- 794af76c: Remove Node 12 support

  - We need move to the new `undici` and does not support Node.js 12

### Minor Changes

- 154b2ecd: refactor: remove @verdaccio/commons-api in favor @verdaccio/core and remove duplications

## 6.0.0-6-next.11

### Minor Changes

- 5fed1955: feat: integrate rematch for ui state storage

## 6.0.0-6-next.10

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

## 6.0.0-6-next.9

### Minor Changes

- 67406082: upgrade to react@17 and other dependencies

## 6.0.0-6-next.8

### Minor Changes

- 0da7031e: allow disable login on ui and endpoints

  To be able disable the login, set `login: false`, anything else would enable login. This flag will disable access via UI and web endpoints.

  ```yml
  web:
    title: verdaccio
    login: false
  ```

## 6.0.0-6-next.7

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

## 6.0.0-6-next.6

### Patch Changes

- 648575aa: Bug Fixes

  - fix escaped slash in namespaced packages

  #### Related tickets

  https://github.com/verdaccio/verdaccio/pull/2193

## 5.0.0-alpha.5

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

## 5.0.0-alpha.4

### Patch Changes

- fecbb9be: chore: add release step to private regisry on merge changeset pr

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

## 5.0.0-alpha.2

### Minor Changes

- 6cb0b588: feat: ui theme plugin part of the application
