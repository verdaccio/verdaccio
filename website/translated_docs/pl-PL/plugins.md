---
id: wtyczki
title: "Wtyczki"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Authentication](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Magazyn danych](plugin-storage.md)
* Custom Theme and filters

> Jeśli jesteś zainteresowany stworzeniem swojej własnej wtyczki, przeczytaj sekcję dotyczącą [programowania](dev-plugins.md).

## Użycie

### Instalacja

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` as a sinopia fork it has backward compability with plugins that are compatible with `sinopia@1.4.0`. In such case the installation is the same.

```
$> npm install --global sinopia-memory
```

### Konfiguracja

Otwórz plik `config.yaml` i zaktualizuj sekcję `auth` następująco:

Domyślna konfiguracja wygląda tak, ponieważ domyślnie używamy wbudowanej wtyczki `htpasswd`, którą można wyłączyć jedynie poprzez komentowanie następujących wierszy.


### Authentication Configuration

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

i zastąpienie ich (w przypadku, gdy zdecydujesz się użyć wtyczki `ldap`).

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

> Możesz uznać [środkową wtyczkę kontroli](https://github.com/verdaccio/verdaccio-audit) jako przykład podstawowy.

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

## Starsze wtyczki

### Wtyczki Sinopia

> If you are relying on any sinopia plugin, remember are deprecated and might no work in the future.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): wtyczka auth dla sinopii obsługujący rejestr npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): wtyczka auth dla sinopii, która przechowuje użytkowników w pamięci.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): wtyczka auth dla sinopii obsługująca atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): wtyczka uwierzytelniająca Active Directory dla sinopii.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): wtyczka uwierzytelniająca dla sinopii2, obsługująca przepływ dla sieci github oauth.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): Wtyczka uwierzytelniająca Sinopii, która deleguje uwirzytelnienie do innego HTTP URL
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alternatywna wtyczka uwierzytelniająca LDAP dla Sinopii
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Łatwa i w pełni uwierzytelniająca wtyczka z konfiguracją do korzystania z zewnętrznego API.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Generate password in htaccess format, encrypt with GPG and send via MailGun API to users.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Łatwa i w pełni autoryzująca wtyczka z konfiguracją do korzystania z bazy danych mongodb.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): i wtyczka autoryzująca dla sinopii obsługująca format htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): wspierana przez leveldb wtyczka uwierzytelniająca dla prywatnego npm sinopii.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): wtyczka uwierzytelniająca Gitlab dla sinopii.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): wtyczka uwierzytelniająca Gitlab dla sinopii
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): wtyczka uwierzytelniająca LDAP dla sinopii.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) Sinopia authentication plugin with github oauth web flow.

> All sinopia plugins should be compatible with all future verdaccio versions. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

