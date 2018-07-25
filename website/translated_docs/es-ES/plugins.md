---
id: plugins
title: "Plugins"
---
Verdaccio is an plugabble aplication. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

> If you are interested to develop your own plugin, read the [development](dev-plugins.md) section.

## Uso

### Instalación

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` como un fork de sinopia tiene compatibilidad con versiones anteriores, con plugins que son compatibles con `sinopia@1.4.0`. En tal caso la instalación es la misma.

    $> npm install --global sinopia-memory
    

### Configuración

Abra el archivo `config.yaml` y actualice la sección `auth` como a continuación:

La configuración por defecto luce así, debido a que usamos un plugin `htpasswd` incorporado por defecto que puede desactivar con solo comentar las siguientes líneas.

### Configuración del Plugin Auth

```yaml
 htpasswd:
    file: ./htpasswd
    #max_users: 1000
```

y reemplazándolos con (en caso de que decida usar un plugin `ldap`).

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Múltiples Plugins Auth

Esto es técnicamente posible, el orden de los plugins se vuelve importante, las credenciales serán resueltas en orden.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    #max_users: 1000
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

### Configuración del Plugin Middleware

Este es un ejemplo de como se instala un plugin middleware. Todos los plugins middleware deben estar definidos en el namespace **middlewares**.

```yaml
middlewares:
  audit:
    enabled: true
```

> You might follow the [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) as base example.

### Configuración del Plugin Store (Almacén)

Este es un ejemplo de como instalar un plugin de almacenamiento. Todos los plugins de almacenamiento debe estar definidos en el namespace **store**.

```yaml
store:
  memory:
    limit: 1000
```

> If you define a custom store, the property **storage** in the configuration file will be ignored.

## Plugins heredados

### Plugins de Sinopia

(compatible con todas las versiones)

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): plugin auth para sinopia soportando un registro npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): plugin auth para sinopia que mantiene a los usuarios en la memoria.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): plugin auth para sinopia que soporta atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): plugin de autenticación Active Directory para sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): plugin de autenticación para sinopia2, el cual soporta el flujo web de github oauth.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): plugin de autenticación de Sinopia que delega autenticación a otro URL HTTP
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alterna el plugin LDAP Auth para Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Un plugin sencillo y completamente auth con configuración para usar una API externa.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Genera contraseña en formato htaccess, encripta con GPG y la evía a través de la API MailGun a los usuarios.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Un plugin fácil y completamente auth con configuración para usar una base de datos mongodb.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): plugin auth para sinopia que soporta el formato htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): un plugin auth leveldb respaldado para el npm privado de sinopia.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): plugin de autenticación de Gitlab para sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): plugin de autenticación de Gitlab para sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): plugin LDAP auth para sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) plugin de autenticación de Sinopia con flujo web github oauth.

> All sinopia plugins should be compatible with all future verdaccio versions. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

## Plugins de Verdaccio

(compatible desde 2.1.x)

### Plugins de Autorización

* [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket): plugin de autenticación de Bitbucket para verdaccio.
* [verdaccio-ldap](https://www.npmjs.com/package/verdaccio-ldap): plugin LDAP auth para verdaccio.
* [verdaccio-active-directory](https://github.com/nowhammies/verdaccio-activedirectory): plugin de autenticación Active Directory para verdaccio
* [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab): use la Token de Acceso Personal de GitLab para autenticarse
* [verdaccio-htpasswd](https://github.com/verdaccio/verdaccio-htpasswd): Auth basado en el plugin del archivo htpasswd (incorporado) para verdaccio
* [verdaccio-github-oauth](https://github.com/aroundus-inc/verdaccio-github-oauth): Github oauth authentication plugin for verdaccio.

### Plugins de Middleware

* [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit): plugin de verdaccio para soporte cli de *npm audit* (incorporado) (compatible desde 3.x)

* [verdaccio-profile-api](https://github.com/ahoracek/verdaccio-profile-api): plugin de verdaccio para soporte cli de *npm profile* y *npm profile set password* para la autenticación basada en *verdaccio-htpasswd*

### Plugins de Storage (Almacenamiento)

(compatible desde 3.x)

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory) Plugin de almacenamiento para alojar paquetes en la Memoria
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage) Plugin de almacenamiento para alojar paquetes **Amazon S3**
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud) Plugin de almacenamiento para alojar paquetes **Google Cloud Storage**

## Advertencias

> Not all these plugins are been tested continuously, some of them might not work at all. Please if you found any issue feel free to notify the owner of each plugin.