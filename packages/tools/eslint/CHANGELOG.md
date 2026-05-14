# @verdaccio/eslint-config

## 13.1.0

### Minor Changes

- a1509fc: Make optional peer plugins (`eslint-plugin-cypress`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-verdaccio`, `@vitest/eslint-plugin`) load lazily via dynamic `import()`. Previously they were declared as optional peerDependencies but imported statically, so the config failed to load if any one was missing. Now consumers can install only the plugins they need; configs whose plugins aren't installed export an empty array.

## 13.0.0

### Minor Changes

- 2dab467: feat: restore eslint-plugin-verdaccio

### Patch Changes

- Updated dependencies [2dab467]
  - eslint-plugin-verdaccio@10.1.0

## 12.1.0

### Minor Changes

- 836925c: fix: move dep as peerdependencies

## 12.0.0

### Major Changes

- 6c04a71: feat: upgrade to eslint 10 flat config

## 11.0.1

### Patch Changes

- 6e2b482: fix: add missing ts dependencies

## 11.0.0

### Major Changes

- 55bf445: feat: bump up

## 11.0.0

### Major Changes

- 0cdc7e9: feat: bump up

## 4.0.0

### Major Changes

- 28fcd9e: feat: move eslint package

## 4.0.0-next-8.2

### Patch Changes

- b24f513: chore(lint): switch rules from jest to vitest

## 4.0.0-next-8.1

### Patch Changes

- e4a1539: chore: package.json maintenance
- 0607e80: chore: update readme badges and license files

## 4.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

## 3.0.0

### Major Changes

- 47f61c6: feat!: bump to v7

## 3.0.0-next.0

### Major Changes

- feat!: bump to v7

## 2.0.0

### Major Changes

- a3a209b5e: feat: migrate to pino.js 8
- 459b6fa72: refactor: search v1 endpoint and local-database
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
    add(name: string): Promise;
    remove(name: string): Promise;
    get(): Promise;
    init(): Promise;
    getSecret(): Promise;
    setSecret(secret: string): Promise;
    getPackageStorage(packageInfo: string): IPackageStorage;
    search(query: searchUtils.SearchQuery): Promise;
    saveToken(token: Token): Promise;
    deleteToken(user: string, tokenKey: string): Promise;
    readTokens(filter: TokenFilter): Promise;
  }
  ```

## 2.0.0-6-next.1

### Major Changes

- a3a209b5: feat: migrate to pino.js 8

## 2.0.0-6-next.0

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
    add(name: string): Promise;
    remove(name: string): Promise;
    get(): Promise;
    init(): Promise;
    getSecret(): Promise;
    setSecret(secret: string): Promise;
    getPackageStorage(packageInfo: string): IPackageStorage;
    search(query: searchUtils.SearchQuery): Promise;
    saveToken(token: Token): Promise;
    deleteToken(user: string, tokenKey: string): Promise;
    readTokens(filter: TokenFilter): Promise;
  }
  ```
