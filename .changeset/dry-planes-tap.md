---
'@verdaccio/api': major
'@verdaccio/auth': major
'@verdaccio/cli': major
'@verdaccio/config': major
'@verdaccio/commons-api': major
'@verdaccio/core': major
'@verdaccio/local-storage': major
'@verdaccio/fastify-migration': major
'@verdaccio/streams': major
'@verdaccio/types': major
'@verdaccio/hooks': major
'verdaccio-audit': major
'verdaccio-aws-s3-storage': major
'verdaccio-google-cloud': major
'verdaccio-memory': major
'@verdaccio/ui-theme': major
'@verdaccio/proxy': major
'@verdaccio/server': major
'@verdaccio/store': major
'@verdaccio/eslint-config': major
'@verdaccio/dev-types': major
'@verdaccio/utils': major
'verdaccio': major
'@verdaccio/web': major
---

refactor: search v1 endpoint and local-database

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
