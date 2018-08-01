---
id: dev-plugins
title: "插件开发"
---
有很多种扩展 `verdaccio`的方法，支持的插件种类有：

* 认证插件
* Middleware 插件 (自 `v2.7.0`)
* 存储插件自 (`v3.x`)

> 我们建议使用[flow类型定义](https://github.com/verdaccio/flow-types)来开发插件。

## Authentication Plugin（认证插件）

基本上我们必须用一个叫做`authenticate`的单一方法来返回一个object（对象），此方法将接收到3 个参数(`user, password, callback`)。

### API

```flow
interface IPluginAuth extends IPlugin {
  login_url?: string;
  authenticate(user: string, password: string, cb: Callback): void;
  adduser(user: string, password: string, cb: Callback): void;
  allow_access(user: RemoteUser, pkg: $Subtype<PackageAccess>, cb: Callback): void;
  allow_publish(user: RemoteUser, pkg: $Subtype<PackageAccess>, cb: Callback): void;
}
```

> 仅 `adduser`, `allow_access` 和`allow_publish` 是可选的，verdaccio 在所有这些例子里提供后退功能。

#### 回调

一旦执行了认证，有两个选项来回应 `verdaccio`。

###### OnError

要么是发生了糟糕的事，要么是授权不成功。

```flow
callback(null, false)
```

###### OnSuccess

授权成功

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

配置将如下所示：

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```

其中`htpasswd` 是插件名称，例如：`verdaccio-htpasswd` 的后缀。剩下的组成部分是插件配置的参数。

## Middleware Plugin（Middleware 插件）

Middleware 插件有修改API 接口的能力，它可以添加新的端点或者拦截请求。

```flow
interface verdaccio$IPluginMiddleware extends verdaccio$IPlugin {
  register_middlewares(app: any, auth: IBasicAuth, storage: IStorageManager): void;
}
```

### register_middlewares

此方法通过`auth`和`storage`提供完全认证访问。`app` 是可以让您添加新端点的表达应用程序。

> Middleware插件的一个很好的例子是[sinopia-github-oauth](https://github.com/soundtrackyourbrand/sinopia-github-oauth) 和 [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit)。

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

要注册middleware，我们需要一个object（对象）以及一个可以接收3 个参数(`expressApp, auth, storage`)，名叫 `register_middlewares`的单一方法。 *Auth*是authentification instance，*storage* 也是主Storage instance，它将让您可以访问到所有存储操作。

## Storage Plugin（存储插件）

Verdaccio 默认使用文件系统存储插件[local-storage](https://github.com/verdaccio/local-storage), 但是，从`verdaccio@3.x` 开始，您可以插入定制存储来取代默认的行为。

### API

存储API 更复杂一些，您将需要创建一个可以返回`IPluginStorage`执行的class（类）。请参阅以下详细信息。

```flow
class LocalDatabase<IPluginStorage>{
  constructor(config: $Subtype<verdaccio$Config>, logger: verdaccio$Logger): ILocalData;
}

interface IPluginStorage {
  logger: verdaccio$Logger;
    config: $Subtype<verdaccio$Config>;
  add(name: string, callback: verdaccio$Callback): void;
  remove(name: string, callback: verdaccio$Callback): void;
  get(callback: verdaccio$Callback): void;
  getSecret(): Promise<string>;
  setSecret(secret: string): Promise<any>;
  getPackageStorage(packageInfo: string): verdaccio$IPackageStorage;
  search(onPackage: verdaccio$Callback, onEnd: verdaccio$Callback, validateName: Function): void;
}

interface IPackageStorageManager {
  path: string;
  logger: verdaccio$Logger;
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

class verdaccio$IUploadTarball extends stream$PassThrough {
  abort: Function;
  done: Function;
  _transform: Function;
  abort(): void;
  done(): void;
}

class verdaccio$IReadTarball extends stream$PassThrough {
  abort: Function;
  abort(): void;
}
```

> 存储API 仍然还在实验阶段，并在接下来的小版本中可能会有修改。 更多有关存储API 的详细信息，请跟随[类型 我们官方资源库里的定义](https://github.com/verdaccio/flow-types)。

### 存储插件示例

以下插件列表执行存储API，可以被用作示例。

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)
* [local-storage](https://github.com/verdaccio/local-storage)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)
* [verdaccio-s3-storage](https://github.com/Remitly/verdaccio-s3-storage/tree/s3)

> 您是否愿意为新存储插件做出贡献？[请点击此处。](https://github.com/verdaccio/verdaccio/issues/103#issuecomment-357478295)