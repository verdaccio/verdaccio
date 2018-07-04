---
id: dev-plugins
title: "插件开发"
---
有很多方法来扩展 `verdaccio`, 目前我们支持 `authentication plugins`, `middleware plugins` (自 `v2.7.0` 版本) 和 `storage plugins` 自 (`v3.x`)版本。

## Authentication Plugin（认证插件）

本节将描述 Verdaccio 插件在ES5 里是如何运作的。 基本上我们要用一个叫做`authenticate` 的简单方法来返回一个 object，此方法将收到3 个参数 (`user, password, callback`)。 一旦执行验证后，有两个可用的值来回应 `verdaccio`。

### API

```js
function authenticate (user, password, callback) {
 ...more stuff
}
```

##### OnError

要么是不好的事发生，要么是授权不成功。

    callback(null, false)
    

##### OnSuccess

授权成功。

`groups`是用户组成的一组字符串。

     callback(null, groups);
    

### 例如

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

设置

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```

其中`htpasswd` 是插件名称的后缀。例如：`verdaccio-htpasswd`，剩下的组成部分是插件配置的参数。

## Middleware插件

Middleware plugins have the capability to modify the API layer, either adding new endpoints or intercepting requests.

> A pretty good example of middleware plugin is the [sinopia-github-oauth](https://github.com/soundtrackyourbrand/sinopia-github-oauth) and [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit).

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

To register a middleware we need an object with a single method called `register_middlewares` that will recieve 3 arguments (`expressApp, auth, storage`). *Auth* is the authentification instance and *storage* is also the main Storage instance that will give you have access to all to the storage actions.

## Storage Plugin

Verdaccio by default uses a file system storage plugin [local-storage](https://github.com/verdaccio/local-storage) but, since `verdaccio@3.x` you can plug in a custom storage.

### API

The storage API is a bit more complex, you will need to create a class that return a `ILocalData` implementation. Please see details bellow.

```js
<br />class LocalDatabase<ILocalData>{
    constructor(config: Config, logger: Logger): ILocalData;
}

declare interface verdaccio$ILocalData {
  add(name: string, callback: verdaccio$Callback): void;
  remove(name: string, callback: verdaccio$Callback): void;
  get(callback: verdaccio$Callback): void;
  getSecret(): Promise<string>;
  setSecret(secret: string): Promise<any>;
  getPackageStorage(packageInfo: string): verdaccio$IPackageStorage;
}

declare interface verdaccio$ILocalPackageManager {
  writeTarball(name: string): verdaccio$IUploadTarball;
  readTarball(name: string): verdaccio$IReadTarball;
  readPackage(fileName: string, callback: verdaccio$Callback): void;
  createPackage(name: string, value: verdaccio$Package, cb: verdaccio$Callback): void;
  deletePackage(fileName: string, callback: verdaccio$Callback): void;
  removePackage(callback: verdaccio$Callback): void;
  updatePackage(pkgFileName: string,
                updateHandler: verdaccio$Callback,
                onWrite: verdaccio$Callback,
                transformPackage: Function,
                onEnd: verdaccio$Callback): void;
  savePackage(fileName: string, json: verdaccio$Package, callback: verdaccio$Callback): void;
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

> The Storage API is still experimental and might change in the next minor versions. For further information about Storage API please follow the [types definitions in our official repository](https://github.com/verdaccio/flow-types).

### Storage Plugins Examples

The following list of plugins are implementing the Storage API and might be used them as example.

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)
* [local-storage](https://github.com/verdaccio/local-storage)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)
* [verdaccio-s3-storage](https://github.com/Remitly/verdaccio-s3-storage/tree/s3)

> Are you willing to contribute with new Storage Plugins? [Click here.](https://github.com/verdaccio/verdaccio/issues/103#issuecomment-357478295)