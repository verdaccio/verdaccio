---
id: plugins
title: "Complementos"
---
Verdaccion es una aplicación extensible. Puede ser extendida en muchas maneras, tanto con nuevos métodos de autenticación, añadiendo endpoints o usando un almacenamiento personalizado.

> Si está interesado en desarrollar su propio complemento, lea la sección [development](development.md).

## Uso

### Instalación

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccion` como un fork de sinopia tiene compatibilidad con versiones anteriores, con complementos que son compatibles con `sinopia@1.4.0`. En tal caso la instalación es la misma.

    $> npm install --global sinopia-memory
    

### Configuración

Abra el archivo `config.yaml` y actualice la sección `auth` como a continuación:

La configuración por defecto luce así, debido a que usamos un complemento build-in `htpasswd` por defecto que puede desactivar con solo comentar las siguientes líneas.

### Configuración del Complemento de Auth

```yaml
 htpasswd:
    file: ./htpasswd
    #max_users: 1000
```

y reemplazándolos con (en caso de que decida usar un complemento `ldap`).

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Múltiples complementos Auth

Esto es técnicamente posible, el orden de los complementos se vuelve importante, las credenciales serán resueltas en orden.

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

### Configuración del Complemento Middleware

Este es un ejemplo de como se instala un complemento middleware. Todos los complementos middleware deben estar definidos en el namespace **middlewares**.

```yaml
middlewares:
  audit:
    enabled: true
```

### Configuraión del Complemento Almacén (Store)

Este es un ejemplo de como instalar un complemento de almacenamiento. Todos los complementos de almacenamiento debe estar definidos en el namespace **store**.

```yaml
store:
  memory:
    limit: 1000
```

> Si define un almacén personalizado, la propiedad **storage** en el archivo de configuración será ignorada.

## Complementos heredados

### Complementos Sinopia

(compatible con todas las versiones)

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): complemento auth para sinopia soportando un registro npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): complemento auth para sinopia que mantiene a los usuarios en la memoria.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): complemento auth para sinopia que soporta la multitud de atlassian.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): complemento de autenticación Active Directory para sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): complemento de autenticación para sinopia2, el cual soporta el flujo web de github oauth.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): complemento de autenticación de Sinopia que delega autenticación a otro URL HTTP
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alterna el complemento LDAP Auth para Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Un complemento sencillo y completamente auth con configuración para usar una API externa.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Genera contraseña en formato htaccess, encripta con GPG y evía a través de la API MailGun a los usuarios.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Un complemento fácil y completamente auth con configuración para usar una base de datos mongodb.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): complemento auth para sinopia que soporta el formato htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): un complemento auth leveldb respaldado para el npm privado de sinopia.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): complemento de autenticación de Gitlab para sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): complemento de autenticación de Gitlab para sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): complemento auth LDAP para sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) complemento de autenticación de Sinopia con flujo web github oauth.

> Todos los complemento de sinopia deben ser compatibles con todas las futuras versiones de verdaccio. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

## Verdaccio Plugins

(compatible since 2.1.x)

### Authorization Plugins

* [verdaccio-bitbucket](https://github.com/idangozlan/verdaccio-bitbucket): Bitbucket authentication plugin for verdaccio.
* [verdaccio-ldap](https://www.npmjs.com/package/verdaccio-ldap): LDAP auth plugin for verdaccio.
* [verdaccio-active-directory](https://github.com/nowhammies/verdaccio-activedirectory): Active Directory authentication plugin for verdaccio
* [verdaccio-gitlab](https://github.com/bufferoverflow/verdaccio-gitlab): use GitLab Personal Access Token to authenticate
* [verdaccio-htpasswd](https://github.com/verdaccio/verdaccio-htpasswd): Auth based on htpasswd file plugin (built-in) for verdaccio

### Middleware Plugins

* [verdaccio-audit](https://github.com/verdaccio/verdaccio-audit): verdaccio plugin for *npm audit* cli support (built-in) (compatible since 3.x)

* [verdaccio-profile-api](https://github.com/ahoracek/verdaccio-profile-api): verdacci plugin for *npm profile* cli support and *npm profile set password* for *verdaccio-htpasswd* based authentificaton

### Storage Plugins

(compatible since 3.x)

* [verdaccio-memory](https://github.com/verdaccio/verdaccio-memory) Storage plugin to host packages in Memory
* [verdaccio-s3-storage](https://github.com/remitly/verdaccio-s3-storage) Storage plugin to host packages **Amazon S3**
* [verdaccio-google-cloud](https://github.com/verdaccio/verdaccio-google-cloud) Storage plugin to host packages **Google Cloud Storage**

## Caveats

> Not all these plugins are been tested continuously, some of them might not work at all. Please if you found any issue feel free to notify the owner of each plugin.