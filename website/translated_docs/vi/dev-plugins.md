---
id: dev-plugins
title: "Phát triển các phần mềm bổ trợ"
---
Có nhiều cách để mở rộng `verdaccio`. Các loại phần mềm bổ trợ là:

* Những phần mềm bổ trợ xác minh
* Phần mềm bổ trợ Middleware (kể từ phiên bản `v2.7.0`)
* Phần mềm bổ trợ lưu trữ từ phiên bản (` v3.x `)

> Chúng tôi khuyên bạn nên phát triển phần mềm bổ trợ bằng cách sử dụng [định nghĩa loại luồng ](https://github.com/verdaccio/flow-types) của chúng tôi.

## Phần mềm bổ trợ xác minh

Cơ bản chúng ta phải trả về một đối tượng với phương thức được gọi là `authenticate`, và sẽ nhận lại 3 tham số (`user, password, callback`).

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

> Chỉ có các tùy chọn là `adduser`, ` allow_access` và `allow_publish` và verdaccio cung cấp chức năng dự phòng trong tất cả các tùy chọn này.

#### Callback

Khi xác thực được thực hiện, có hai tùy chọn để trả lời `verdaccio`.

###### OnError

Hiện lỗi này nghĩa là hoặc xảy ra lỗi hoặc xác thực không thành công.

```flow
callback(null, false)
```

###### OnSuccess

Xác thực thành công.

`groups` là một tập hợp các chuỗi người dùng.

     callback(null, groups);
    

### Ví dụ

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

Cấu hình sẽ trông như thế này:

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```

Trong đó `htpasswd` là tên của plugin, ví dụ: hậu tố của `verdaccio-htpasswd`. Các mã còn lại là các tham số của cấu hình plugin.

## Phần mềm bổ trợ Middleware

Phần mềm bổ trợ Middleware có khả năng sửa đổi giao diện API để thêm các điểm cuối mới hoặc chặn các yêu cầu.

```flow
interface verdaccio$IPluginMiddleware extends verdaccio$IPlugin {
  register_middlewares(app: any, auth: IBasicAuth, storage: IStorageManager): void;
}
```

### register_middlewares

Phương thức này sẽ cung cấp đầy đủ cách truy cập để xác thực và lưu trữ thông qua `auth` và `storage`. Nếu bạn muốn thêm điểm cuối mới, hãy dùng ứng dụng `app`.

> Một ví dụ điển hình về phần mềm bổ trợ Middleware là [ sinopia-github-oauth ](https://github.com/soundtrackyourbrand/sinopia-github-oauth) và <a href = "https: // Github.com/verdaccio/verdaccio-audit">verdaccio-audit </a>.

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

Bằng cách sử dụng một cách thức duy nhất để đăng ký middleware là `register_middlewares`, chúng ta cần tìm một đối tượng có thể nhận được 3 tham số (` expressApp, auth, storage `) được gọi là. Lớp xác thực *Auth* và lớp lưu trữ chính *storage* cho phép bạn truy cập vào tất cả các hoạt động lưu trữ.

## Phần mềm bổ trợ lưu trữ

Theo mặc định, Verdaccio sử dụng phần mềm bổ trợ lưu trữ hệ thống tệp [local-storage](https://github.com/verdaccio/local-storage), tuy nhiên, từ phiên bản `verdaccio@3.x ` bạn có thể chèn lưu trữ tùy chỉnh thay vì hành vi mặc định.

### API

The storage API is a bit more complex, you will need to create a class that return a `IPluginStorage` implementation. Please see details bellow.

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

> The Storage API is still experimental and might change in the next minor versions. For further information about Storage API please follow the [types definitions in our official repository](https://github.com/verdaccio/flow-types).

### Storage Plugins Examples

The following list of plugins are implementing the Storage API and might be used them as example.

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)
* [local-storage](https://github.com/verdaccio/local-storage)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)
* [verdaccio-s3-storage](https://github.com/Remitly/verdaccio-s3-storage/tree/s3)

> Are you willing to contribute with new Storage Plugins? [Click here.](https://github.com/verdaccio/verdaccio/issues/103#issuecomment-357478295)