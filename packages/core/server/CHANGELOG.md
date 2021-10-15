# @verdaccio/fastify-migration

## 6.0.0-6-next.14

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
  - @verdaccio/logger@6.0.0-6-next.6
  - @verdaccio/store@6.0.0-6-next.14

## 6.0.0-6-next.13

### Patch Changes

- Updated dependencies [2c594910]
  - @verdaccio/logger@6.0.0-6-next.5
  - @verdaccio/auth@6.0.0-6-next.12
  - @verdaccio/store@6.0.0-6-next.13

## 6.0.0-6-next.12

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
  - @verdaccio/store@6.0.0-6-next.12
  - @verdaccio/logger@6.0.0-6-next.4

## 6.0.0-6-next.11

### Patch Changes

- df0da3d6: Added core-js missing from dependencies though referenced in .js sources
  - @verdaccio/auth@6.0.0-6-next.10
  - @verdaccio/store@6.0.0-6-next.11

## 6.0.0-6-next.10

### Minor Changes

- 55ee3fdd: [Fastify] Add ping endpoint
