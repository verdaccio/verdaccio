---
id: plugins
title: "Plugins"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Authentication](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Stockage](plugin-storage.md)
* Custom Theme and filters

> Si vous souhaitez développer votre plugin personnel, lisez la section [development](dev-plugins.md).

## Utilisation

### Installation

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` as a sinopia fork it has backward compability with plugins that are compatible with `sinopia@1.4.0`. In such case the installation is the same.

```
$> npm install --global sinopia-memory
```

### Configuration

Ouvrez le fichier `>config.yaml` et mettez à jour la section `auth` comme suit :

La configuration par défaut ressemble à ceci, car nous utilisons un plugin intégré `htpasswd` qui peut être désactivé en commentant les lignes suivantes.


### Authentication Configuration

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

et en les remplaçant par (si vous décidez d'utiliser un plugin `ldap`.

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Multiple Authentication plugins

This is technically possible, making the plugin order important, as the credentials will be resolved in order.

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

### Middleware Configuration

This is an example how to set up a middleware plugin. All middleware plugins must be defined in the **middlewares** namespace.

```yaml
middlewares:
  audit:
    enabled: true
```

> Vous pouvez suivre le [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) comme exemple de base.

### Storage Configuration

This is an example how to set up a storage plugin. All storage plugins must be defined in the **store** namespace.

```yaml
store:
  memory:
    limit: 1000
```

### Theme Configuration

Verdaccio allows to replace the User Interface with a custom one, we call it **theme**. By default, uses `@verdaccio/ui-theme` that comes built-in, but, you can use something different installing your own plugin.

```bash

$> npm install --global verdaccio-theme-dark

```

> The plugin name prefix must start with `verdaccio-theme`, otherwise the plugin won't load.


You can load only one theme at a time and pass through options if you need it.

```yaml
theme:
  dark:
    option1: foo
    option2: bar
```

## Plugins hérités

### Sinopia Plugins

> If you are relying on any sinopia plugin, remember are deprecated and might no work in the future.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): plugin d'authentification pour la prise en charge de sinopia avec un journal npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): plugin d'authentification pour sinopia qui se souvient des utilisateurs.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [ sinopia-crowd ](https://www.npmjs.com/package/sinopia-crowd): plugin d'authentification pour sinopia qui prend en charge le public atlassien.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): plugin d'authentification Ative Directory pour sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): plugin d'authentification pour sinopia2, prenant en charge le flux web github oauth.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): plugin d’authentification Sinopia qui délègue l’authentification vers une autre URL HTTP
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): plugin remplaçant LDAP Auth pour Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): un facile auth-plugin, entier, avec configuration pour utiliser une API externe.
* [sinopia-htaccess-gpg-mail](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): générer le mot de passe au format htaccess, chiffrer avec GPG et envoyer via l’API MailGun pour les utilisateurs.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): un facile auth-plugin, entier, avec configuration pour utiliser une base de données mongodb.
* [ sinopia-crowd ](https://www.npmjs.com/package/sinopia-htpasswd): plugin d'authentification pour sinopia qui prend en charge le format htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): plugin auth pris en charge par leveldb pour la synchronisation privée npm.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): plugin d'authentification Gitlab pour sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): plugin d'authentification Gitlab pour sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): plugin d'authentification LDAP pour sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) plugin d'authentification pour Sinopia avec une interface Web github oauth.

> Tous les plugins de Sinopia devraient être compatibles avec toutes les futures versions de Verdaccio. Cependant, nous encourageons les contributeurs à les transférer vers l’API moderne de verdaccio et à utiliser le préfixe * verdaccio-xx-name *.

