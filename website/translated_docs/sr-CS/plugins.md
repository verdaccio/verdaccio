---
id: plugins
title: "Plugins"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Authentication](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Memorija za skladištenje](plugin-storage.md)
* Custom Theme and filters

> Ako ste zainteresovani da razvijete sopstveni plugin, pročitajte [development](dev-plugins.md) sekciju.

## Korišćenje

### Instalacija

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` as a sinopia fork it has backward compability with plugins that are compatible with `sinopia@1.4.0`. In such case the installation is the same.

```
$> npm install --global sinopia-memory
```

### Konfigurisanje

Otvorite `config.yaml` fajl i uradite update `auth` sekcije prema sledećim uputstvima:

Podrazumevana konfiguracija izgleda ovako, jer koristimo ugrađeni `htpasswd` plugin kao podrazumevan, a koji možete zaustaviti (disable) tako što ćete sledeće linije pretvoriti u komentar.


### Authentication Configuration

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

i zameniti ih sa datim (ako se odlučite da koristite `ldap` plugin).

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

> Možete pratiti [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) kao bazični primer.

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

## Tradicionalni plugini (Legacy plugins)

### Sinopia Plugins

> If you are relying on any sinopia plugin, remember are deprecated and might no work in the future.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): auth plugin za sinopia koji podržava npm registry.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): auth plugin za sinopia koji čuva korisnike u memoriji.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): auth plugin za sinopia koji podržava atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): Active Directory authentication plugin za sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): authentication plugin za sinopia2, podržava github oauth web flow.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): Sinopia authentication plugin koji delegira authentifikaciju za drugi HTTP URL
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alternativni LDAP Auth plugin za Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Jednostavan i celovit auth-plugin sa konfiguracijom za korišćenjem eksternih API.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Generiše password u htaccess formatu, encrypt sa GPG i šalje preko MailGun API do korisnika.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Jednostavan i celovit auth-plugin sa konfiguracijom za korišćenje mongodb database.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): auth plugin za sinopia koji podržava htpasswd format.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): a leveldb podržan auth plugin za sinopia private npm.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): Gitlab authentication plugin za sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): Gitlab authentication plugin za sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): LDAP auth plugin za sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) Sinopia authentication plugin sa github oauth web flow.

> Svi sinopia pluginsi, trebalo bi da budu kompatibilni sa svim budućim verzijama verdaccio-a. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

