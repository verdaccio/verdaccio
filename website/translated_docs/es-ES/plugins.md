---
id: plugins
title: "Complementos"
---
Verdaccion es una aplicación extensible. Puede ser extendida en muchas maneras, tanto con nuevos métodos de autenticación, añadiendo endpoints o usando un almacenamiento personalizado.

> Si está interesado en desarrollar su propio plugin, lea la sección [development](development.md).

## Uso

### Instalación

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccion` como un fork de sinopia tiene compatibilidad con versiones anteriores, con plugins que son compatibles con `sinopia@1.4.0`. En tal caso la instalación es la misma.

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

### Configuraión del Plugin Store (Almacén)

Este es un ejemplo de como instalar un plugin de almacenamiento. Todos los plugins de almacenamiento debe estar definidos en el namespace **store**.

```yaml
store:
  memory:
    limit: 1000
```

> Si define un almacén personalizado, la propiedad **storage** en el archivo de configuración será ignorada.

## Plugins heredados

### Plugins de Sinopia

(compatible con todas las versiones)

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): plugin auth para sinopia soportando un registro npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): plugin auth para sinopia que mantiene a los usuarios en la memoria.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): plugin auth para sinopia que soporta la multitud de atlassian.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): plugin de autenticación Active Directory para sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): plugin de autenticación para sinopia2, el cual soporta el flujo web de github oauth.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): plugin de autenticación de Sinopia que delega autenticación a otro URL HTTP
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alterna el plugin LDAP Auth para Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Un complemento sencillo y completamente auth con configuración para usar una API externa.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Genera contraseña en formato htaccess, encripta con GPG y evía a través de la API MailGun a los usuarios.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Un complemento fácil y completamente auth con configuración para usar una base de datos mongodb.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): plugin auth para sinopia que soporta el formato htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): un plugin auth leveldb respaldado para el npm privado de sinopia.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): plugin de autenticación de Gitlab para sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): plugin de autenticación de Gitlab para sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): plugin LDAP auth para sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) plugin de autenticación de Sinopia con flujo web github oauth.

> Todos los plugins de sinopia deben ser compatibles con todas las futuras versiones de verdaccio. De cualquier forma, alentamos a los contribuyentes a migrarlos a la API moderna de verdaccio y usar el prefijo como *verdaccio-xx-name*.

## Plugins de Verdaccio

(compatible desde 2.1.x)

### Plugins de Autorización

* [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket): plugin de autenticación de Bitbucket para verdaccio.
* [verdaccio-ldap](https://www.npmjs.com/package/verdaccio-ldap): plugin LDAP auth para verdaccio.
* [verdaccio-active-directory](https://github.com/nowhammies/verdaccio-activedirectory): plugin de autenticación Active Directory para verdaccio
* [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab): use la Token de Acceso Personal de GitLab para autenticarse
* [verdaccio-htpasswd](https://github.com/verdaccio/verdaccio-htpasswd): basado en Auth en el plugin del archivo htpasswd (incorporado) para verdaccio

### Plugins de Middleware

* [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit): plugin de verdaccio para soporte cli de *npm audit* (incorporado) (compatible desde 3.x)

* [verdaccio-profile-api](https://github.com/ahoracek/verdaccio-profile-api): verdacci plugin for *npm profile* cli support and *npm profile set password* for *verdaccio-htpasswd* based authentificaton

### Storage Plugins

(compatible since 3.x)

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory) Storage plugin to host packages in Memory
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage) Storage plugin to host packages **Amazon S3**
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud) Storage plugin to host packages **Google Cloud Storage**

## Caveats

> Not all these plugins are been tested continuously, some of them might not work at all. Please if you found any issue feel free to notify the owner of each plugin.