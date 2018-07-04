---
id: dev-plugins
title: "插件开发"
---
有很多方法来扩展 `verdaccio`, 目前我们支持 `authentication plugins`, `middleware plugins` (自 `v2.7.0` 版本) 和 `storage plugins` 自 (`v3.x`)版本。

## Authentication Plugin（认证插件）

本节将描述 Verdaccio 插件在ES5 里是如何运作的。 基本上我们要用一个叫做`authenticate` 的单纯方法来返回一个 object（对象），此方法将接收到3 个参数 (`user, password, callback`)。 一旦执行验证后，有两个可用的值来回应 `verdaccio`。

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

Middleware 插件有能力修改API 接口，它可以添加新的端点，也可以截取请求。

> Middleware 插件的一个很好的例子是 [sinopia-github-oauth](https://github.com/soundtrackyourbrand/sinopia-github-oauth) 和 [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit)。

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

要注册middleware，我们需要一个object（对象) 以及一个叫做`register_middlewares` 的单纯方法，它将接收到3 个参数 (`expressApp, auth, storage`)。 *Auth* 是authentification 实例参数，*storage* 也是主存储实例，它将让您可以访问所有的存储操作。

## 存储插件

Verdaccio 默认使用文件系统存储插件 [local-storage](https://github.com/verdaccio/local-storage) ，但是从`verdaccio@3.x` 版本开始，您可以插入自定义存储。

### API

API 存储更复杂一些，您得创建一个返回实现`ILocalData`的 class。请参阅以下详细信息。

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

> API存储任然还在实验阶段并在接下来的次版本中可能会有修改。 有关存储API的更多信息，请遵循[ 我们官网资源库里的类型定义](https://github.com/verdaccio/flow-types)。

### 存储插件示例

以下插件列表执行存储API，可以作为示例。

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)
* [local-storage](https://github.com/verdaccio/local-storage)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)
* [verdaccio-s3-storage](https://github.com/Remitly/verdaccio-s3-storage/tree/s3)

> 您是否愿意为新的存储插件做贡献？请[点击此处。](https://github.com/verdaccio/verdaccio/issues/103#issuecomment-357478295)