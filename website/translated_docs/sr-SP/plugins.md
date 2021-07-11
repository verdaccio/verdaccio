---
id: plugins
title: "Plugins"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Authentication](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Меморија за складиштење](plugin-storage.md)
* Custom Theme and filters

> Ако сте заинтересовани да развијете сопствени plugin, прочитајте [development](dev-plugins.md) секцију.

## Коришћење

### Инсталација

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` as a sinopia fork it has backward compability with plugins that are compatible with `sinopia@1.4.0`. In such case the installation is the same.

```
$> npm install --global sinopia-memory
```

### Конфигурисање

Отворите `config.yaml` фајл и урадите update `auth` секције према следећим упутствима:

Подразумевана конфигурација изгледа овако, јер користимо уграђени `htpasswd` plugin као подразумеван, а који можете зауставити (disable) тако што ћете следеће линије претворити у коментар.


### Authentication Configuration

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

и заменити их са датим (ако се одлучите да користите `ldap` plugin).

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

> Можете пратити [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) као базични пример.

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

## Традиционални плугини (Legacy plugins)

### Sinopia Plugins

> If you are relying on any sinopia plugin, remember are deprecated and might no work in the future.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): auth plugin за sinopia који подржава npm registry.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): auth plugin за sinopia који чува кориснике у меморији.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): auth plugin за sinopia који подржава atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): Active Directory authentication plugin за sinopia.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): authentication plugin за sinopia2, подржава github oauth web flow.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): Sinopia authentication plugin који delegira authentifikaciju за други HTTP URL
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Алтернативни LDAP Auth plugin за Sinopia
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): Једноставан и целовит auth-plugin са конфигурацијом за коришћењем екстерних API.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Генерише password у htaccess формату, encrypt са GPG и шаље преко MailGun API до корисника.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): Једноставан и целовит auth-plugin са конфигурацијом за коришћење mongodb database.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): auth plugin за sinopia који подржава htpasswd формат.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): a leveldb подржан auth plugin за sinopia private npm.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): Gitlab authentication plugin за sinopia.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): Gitlab authentication plugin за sinopia
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): LDAP auth plugin за sinopia.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) Sinopia authentication plugin са github oauth web flow.

> Сви sinopia plugins-и, требало би да буду компатибилни са свим будућим верзијама verdaccio-а. Anyhow, we encourage contributors to migrate them to the modern verdaccio API and using the prefix as *verdaccio-xx-name*.

