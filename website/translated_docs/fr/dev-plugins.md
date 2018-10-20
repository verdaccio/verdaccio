---
id: dev-plugins
title: "Développement des Plugins"
---
Il existe plusieurs façons pour étendre `verdaccio`, les types de plugins pris en charge sont :

* Plugins d’authentification
* Plugins Middleware (depuis `v2.7.0`)
* Plugins de stockage depuis (`v3.x`)

> Nous vous recommandons de développer des plugins à l'aide de nos [ définitions des types de flux ](https://github.com/verdaccio/flow-types).

## Plugin d’authentification

Fondamentalement, nous devons renvoyer un objet avec une seule méthode appelée `authentifier` qui recevra 3 arguments (`utilisateur, mot de passe, rappel`).

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

> Seuls `adduser`, `allow_access` et `allow_publish` sont facultatifs, verdaccio fournit une solution de secours dans tous ces cas.

#### Rappel

Une fois l’authentification effectuée, il existe 2 options possibles pour répondre à `verdaccio`.

###### OnError

Soit que quelque chose de mauvais s'est produite, ou que l'authentification a échoué.

```flow
callback(null, false)
```

###### OnSuccess

L’authentification a réussi.

`groups` est un tableau de chaînes dont l'utilisateur fait partie.

     callback(null, groups);
    

### Exemple

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

Et la configuration ressemblera à ceci:

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```

Où `htpasswd` est le suffixe du nom du plugin. ex: `verdaccio-htpasswd` et le reste du corps serait composé des paramètres de configuration du plugin.

## Middleware Plugin

Les plugins middleware peuvent modifier le niveau de l'API, en ajoutant de nouveaux points de terminaison ou en interceptant des demandes.

```flow
interface verdaccio$IPluginMiddleware extends verdaccio$IPlugin {
  register_middlewares(app: any, auth: IBasicAuth, storage: IStorageManager): void;
}
```

### register_middlewares

Cette méthode fournit un accès complet à l'authentification et à l'archivage via `auth` et `storage`. `app` est l'application rapide qui permet d'ajouter de nouveaux points de terminaison.

> Un très bon exemple de plugin Middleware est le [sinopia-github-oauth](https://github.com/soundtrackyourbrand/sinopia-github-oauth) et [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit).

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

Pour enregistrer un middleware, nous avons besoin d'un objet avec une seule méthode appelée `register_middlewares`, qui recevra 3 arguments (`expressApp, auth, storage`). *Auth* est l'instance d'authentification et *storage* est également l'instance de stockage principale qui donnera accès à toutes les actions de stockage.

## Plugin de stockage

Verdaccio utilise par défaut une extension de stockage du système de fichiers [local-storage](https://github.com/verdaccio/local-storage), mais à partir de `verdaccio @ 3.x` vous pouvez brancher un stockage personnalisé qui remplacera le comportement par défaut.

### API

L'API de stockage étant un peu plus complexe, vous devez créer une classe qui renvoie une implémentation `IPluginStorage`. Veuillez consulter les détails ci-dessous.

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

> L'API de stockage est toujours expérimental et peut changer dans les versions mineures ultérieures. Pour plus d'informations sur l'API de stockage, veuillez suivre les [définitions de type dans nos archives officielles](https://github.com/verdaccio/flow-types).

### Exemples de Plugins de Stockage

Vous trouverez ci-dessous une liste des extensions utilisant l'API de stockage et pouvant être utilisées à titre d'exemple.

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)
* [local-storage](https://github.com/verdaccio/local-storage)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)
* [verdaccio-s3-storage](https://github.com/Remitly/verdaccio-s3-storage/tree/s3)

> Voulez-vous contribuer avec de nouveaux Plugins de Stockage?[Appuyez ici.](https://github.com/verdaccio/verdaccio/issues/103#issuecomment-357478295)