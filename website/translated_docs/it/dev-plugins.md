---
id: dev-plugins
title: "Sviluppare Estensioni"
---
Esistono diversi modi di ampliare `verdaccio`, i tipi di estensioni supportati sono:

* Plugin di autenticazione
* Plugin Middleware (da `v2.7.0`)
* Plugin di archiviazione da (`v3.x`)

> Consigliamo di sviluppare estensioni utilizzando le nostre [definizioni di tipo di flusso](https://github.com/verdaccio/flow-types).

## Plugin di autenticazione

Fondamentalmente dobbiamo restituire un oggetto con un unico metodo chiamato `authenticate` che riceverà 3 argomenti (`user, password, callback`).

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

> Solamente `adduser`, `allow_access` e `allow_publish` sono facoltativi, verdaccio fornisce una soluzione di ripiego in tutti questi casi.

#### Callback

Una volta che l'autenticazione viene eseguita, esistono 2 possibili opzioni per dare una risposta a `verdaccio`.

###### OnError

Nel caso in cui qualcosa sia andato storto oppure l'auth sia fallita.

```flow
callback(null, false)
```

###### OnSuccess

Nel caso in cui l'auth sia andata a buon fine.

`groups` è un array di stringhe di cui l'utente fa parte.

     callback(null, groups);
    

### Esempio

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

E la configurazione apparirà così:

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```

Dove `htpasswd` è il suffisso del nome del plugin. es: `verdaccio-htpasswd` ed il resto del body sarebbe composto dai parametri di configurazione del plugin.

## Plugin Middleware

Le estensioni Middleware possiedono la capacità di modificare il livello API, aggiungendo nuovi endpoint o intercettando le richieste.

```flow
interface verdaccio$IPluginMiddleware extends verdaccio$IPlugin {
  register_middlewares(app: any, auth: IBasicAuth, storage: IStorageManager): void;
}
```

### register_middlewares

Questo metodo fornisce un accesso completo all'autenticazione ed all'archiviazione tramite `auth` and `storage`. `app` è l'applicazione rapida che permette l'aggiunta di nuovi endpoint.

> Un bell'esempio di plugin middleware è il [sinopia-github-oauth](https://github.com/soundtrackyourbrand/sinopia-github-oauth) ed il [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit).

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

Per registrare un middleware necessitiamo di un oggetto con un unico metodo chiamato `register_middlewares` il quale riceverà 3 argomenti (`expressApp, auth, storage`). *Auth* è l'istanza di autenticazione e *storage* è anche la principale istanza di Archiviazione che darà accesso a tutte le azioni di memorizzazione.

## Plugin di archiviazione

Verdaccio by default uses a file system storage plugin [local-storage](https://github.com/verdaccio/local-storage), but, since `verdaccio@3.x` you can plug in a custom storage replacing the default behaviour.

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