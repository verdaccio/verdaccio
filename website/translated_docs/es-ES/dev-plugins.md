---
id: dev-plugins
title: "Extensiones en Desarrollo"
---
Hay muchas maneras de extender `verdaccio`, actualmente apoyamos `extensiones de autenticación`, `extensiones de middleware` (desde `v2.7.0`) y `extensiones de almacenamiento` desde (`v3.x`).

## Extensión de Autenticación

Esta sección describe cómo se ve una extensión de Verdaccio de manera ES5. Básicamente tenemos que devolver un objeto con un único método llamado `autenticar` que recibirá 3 argumentos (`usuario, contraseña, devolución de llamada`). Una vez que la autenticación haya sido ejecutada habrán 2 opciones con las que se podrá dar una respuesta a `verdaccio`.

### API

```js
function authenticate (user, password, callback) {
 ...more stuff
}
```

##### EnError

Algo malo sucedió o la autenticación no tuvo éxito.

    callback(null, false)
    

##### EnÉxito

La autenticación tuvo éxito.

`groups` es una matriz de cadenas de caracteres donde el usuario participa.

     callback(null, groups);
    

### Ejemplo

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

Y la configuración

```yaml
auth:
  htpasswd:
    file: ./htpasswd
```

Donde `htpasswd` es el sufijo del nombre de la extensión. Por ejemplo: `verdaccio-htpasswd` y el resto del cuerpo serían los parámetros de configuración de la extensión.

## Extensión de Middleware

Las extensiones de Middleware tienen la capacidad de modificar la capa de API, ya sea añadiendo extremos o peticiones de interceptación.

> Un muy buen ejemplo de la extensión de middleware es [sinopia-github-oauth](https://github.com/soundtrackyourbrand/sinopia-github-oauth) y [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit).

### API

```js
function register_middlewares(expressApp, authInstance, storageInstance) {
   /* more stuff */
}
```

Para registrar un middleware necesitamos un objeto con un único método llamado `register_middlewares` que recibirá 3 argumentos (`expressApp, auth, storage`). *Auth* es la instancia de autentificación y *storage* es de igual manera la instancia de Almacenamiento principal que te dará el acceso a todas las acciones de almacenamiento.

## Extensión de Almacenamiento

Verdaccio por defecto utiliza una extensión de almacenamientos de sistema de archivos [local-storage](https://github.com/verdaccio/local-storage) pero, desde `verdaccio@3.x` puedes añadir un almacenamiento personalizado.

### API

El API de almacenamiento es un poco más complejo, necesitarás crear una clase que devuelva una implementación de `ILocalData`. Por favor, mira los detalles que aparecen a continuación.

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

> El API de Almacenamiento todavía es experimental y podría cambiar en las próximas versiones menores. Para más información acerca del API de Almacenamiento por favor sigue los [tipos y definiciones en nuestro repositorio oficial](https://github.com/verdaccio/flow-types).

### Ejemplos de Extensiones de Almacenamiento

La siguiente lista de extensiones implementan el API de Almacenamiento y pueden ser utilizados como ejemplo.

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory)
* [local-storage](https://github.com/verdaccio/local-storage)
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud)
* [verdaccio-s3-storage](https://github.com/Remitly/verdaccio-s3-storage/tree/s3)

> ¿Estás dispuesto a contribuir con nuevas extensiones de almacenamiento? [Haz click aquí.](https://github.com/verdaccio/verdaccio/issues/103#issuecomment-357478295)