---
id: dev-plugins
title: "Tworzenie wtyczek"
---
Istnieje wiele sposobów na rozszerzenie funkcjonalności `verdaccio`, wspierane są następujące rodzaje wtyczek:

* Wtyczki uwierzytelniania
* Wtyczki oprogramowania pośredniego (od wersji `v2.7.0`)
* Wtyczki magazynu danych od wersji (`v3.x`)

> We recommend developing plugins using our [flow type definitions](https://github.com/verdaccio/flow-types).

## Wtyczka uwierzytelniania

Musimy tylko zwrócić obiekt pojedynczą metodą `authenticate`, która otrzyma 3 argumenty (`user, password, callback`).

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

> Tylko `dduser`, `allow_access` i `allow_publish` są opcjonalne, verdaccio zapewnia cofnięcie we wszystkich tych przypadkach.

#### Callback

Po wykonaniu uwierzytelniania mamy 2 opcje na odpowiedź do `verdaccio`.

###### OnError

Gdy coś złego się wydarzy, lub uwierzytelnianie nie powiedzie się.

```flow
callback(null, false)
```

###### OnSuccess

Uwierzytelnianie zakończone sukcesem.

`grupy` to tablica ciągów znaków, w których użytkownik jest częścią.

     callback(null, groups);
    

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

Konfiguracja będzie wyglądać następująco:

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```

Gdzie `htpasswd` jest przyrostkiem nazwy wtyczki. np: `verdaccio-htpasswd`, a reszta będzie parametrem konfiguracyjnym wtyczki.

## Wtyczka oprogramowania pośredniego

Middleware plugins have the capability to modify the API layer, either adding new endpoints or intercepting requests.

```flow
interface verdaccio$IPluginMiddleware extends verdaccio$IPlugin {
  register_middlewares(app: any, auth: IBasicAuth, storage: IStorageManager): void;
}
```

### register_middlewares

The method provide full access to the authentification and storage via `auth` and `storage`. `app` is the express application that allows you to add new endpoints.

> A pretty good example of middleware plugin is the [sinopia-github-oauth](https://github.com/soundtrackyourbrand/sinopia-github-oauth) and [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit).

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

Aby zarejestrować oprogramowanie pośrednie potrzebujemy obiekt z pojedynczą metodą `register_middlewares`, która otrzyma 3 argumenty (`expressApp, auth, storage`). *Auth* is the authentification instance and *storage* is also the main Storage instance that will give you have access to all to the storage actions.

## Wtyczka magazynu danych

Verdaccio by default uses a file system storage plugin [local-storage](https://github.com/verdaccio/local-storage), but, since `verdaccio@3.x` you can plug in a custom storage replacing the default behaviour.

### API

API magazynu danych jest trochę bardziej skomplikowane, będziesz musiał stworzyć klasę, która zwraca implementację `IPluginStorage`. Poniżej zapoznasz się ze szczegółami.

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

> API magazynu danych jest nadal w fazie eksperymentalnej i może się zmienić w następnej pomniejszej wersji. For further information about Storage API please follow the [types definitions in our official repository](https://github.com/verdaccio/flow-types).

### Przykłady wtyczek magazynu danych

Poniższa lista wtyczek wdraża API magazynu danych oraz mogą być użyte jako przykład.

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)
* [local-storage](https://github.com/verdaccio/local-storage)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)
* [verdaccio-s3-storage](https://github.com/Remitly/verdaccio-s3-storage/tree/s3)

> Chciałbyś współtworzyć ten projekt z nowymi wtyczkami magazynu danych? [Kliknij tutaj.](https://github.com/verdaccio/verdaccio/issues/103#issuecomment-357478295)