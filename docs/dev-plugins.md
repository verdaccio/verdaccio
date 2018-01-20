---
id: dev-plugins
title: "Developing Plugins"
---

There are many ways to extend `verdaccio`, currently we support `authentication plugins`, `middleware plugins` (since `v2.7.0`) and `storage plugins` since (`v3.x`).

## Authentication Plugins

This section will describe how it looks like a Verdaccio plugin in a ES5 way. Basically we have to return an object with a single method called `authenticate` that will recieve 3 arguments (`user, password, callback`). Once the authentication has been executed there is 2 options to give a response to `verdaccio`.

### API

```js
function authenticate (user, password, callback) {
 ...more stuff
}
```

##### OnError

Either something bad happened or auth was unsuccessful.

```
callback(null, false)
```

##### OnSuccess

The auth was successful.


`groups` is an array of strings where the user is part of.

```
 callback(null, groups);
```

### Example

```javascript
function Auth(config, stuff) {
  var self = Object.create(Auth.prototype);
  self._users = {};

  // config for this module
  self._config = config;

  // verdaccio logger
  self._logger = stuff.logger;

  // pass verdaccio logger to ldapauth
  self._config.client_options.log = stuff.logger;

  return self;
}

Auth.prototype.authenticate = function (user, password, callback) {
  var LdapClient = new LdapAuth(self._config.client_options);
  ....
  LdapClient.authenticate(user, password, function (err, ldapUser) {
    ...
    var groups;
     ...
    callback(null, groups);
  });
};

module.exports = Auth;
```

And the setup

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```
Where `htpasswd` is the sufix of the plugin name. eg: `verdaccio-htpasswd` and the rest of the body would be the plugin configuration params.

## Middleware Integration

Middleware plugins have the capability to modify the API layer, either adding new endpoints or intercepting requests. A pretty good example
of middleware plugin is the (sinopia-github-oauth)[https://github.com/soundtrackyourbrand/sinopia-github-oauth]) compatible with `verdaccio`.

### API

```js
function register_middlewares(expressApp, auth, storage) {
   ...more stuff
}
```

To register a middleware we need an object with a single method called `register_middlewares` that will recieve 3 arguments (`expressApp, auth, storage`).
*Auth* is the authentification instance and *storage* is also the main Storage instance that will give you have access to all to  the storage actions.


## Storage Plugins

Since `verdaccio@3.x` we also can plug a custom storage.

### API

The storage API is a bit more complex, you will need to create a class that return a `ILocalData` implementation. Please see details bellow.

```js

class LocalDatabase<ILocalData>{
    constructor(config: Config, logger: Logger): ILocalData;
}

interface ILocalData {
  add(name: string): SyncReturn;
  remove(name: string): SyncReturn;
  get(): StorageList;
  getPackageStorage(packageInfo: string): IPackageStorage;
  sync(): ?SyncReturn;
}

interface ILocalPackageManager {
  writeTarball(name: string): IUploadTarball;
  readTarball(name: string): IReadTarball;
  readPackage(fileName: string, callback: Callback): void;
  createPackage(name: string, value: any, cb: Callback): void;
  deletePackage(fileName: string, callback: Callback): void;
  removePackage(callback: Callback): void;
  updatePackage(pkgFileName: string,
                updateHandler: Callback,
                onWrite: Callback,
                transformPackage: Function,
                onEnd: Callback): void;
  savePackage(fileName: string, json: Package, callback: Callback): void;
}

interface IUploadTarball extends stream$PassThrough {
  abort(): void;
  done(): void;
}

interface IReadTarball extends stream$PassThrough {
  abort(): void;
  done(): void;
}
```

> This API still is experimental and might change next minor versions. The default [LocalStorage plugin](https://github.com/verdaccio/local-storage) it comes built-in in `verdaccio` and it is being
loaded if any storage plugin has been defined.
