---
id: plugins
title: "Плагины"
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

* [Аутентификация](plugin-auth.md)
* [Middleware](plugin-middleware.md)
* [Хранилище](plugin-storage.md)
* Custom Theme and filters

> Если вам нужно разработать свой плагин, почитайте секцию [разработка](dev-plugins.md).

## Использование

### Установка

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio`, как форк sinopia, совместим с плагинами для `sinopia@1.4.0`. Установка таких плагинов - аналогична.

```
$> npm install --global sinopia-memory
```

### Конфигурация

Откройте файл `config.yaml` и измените секцию `auth` так, как указано ниже:

Дефолтная конфигурация выглядит так, потому что мы, по умолчанию, используем встроенный плагин `htpasswd`, который вы можете отключить, просто закомментировав строчку.


### Конфигурирование аутентификации

```yaml
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

заменяем на (в случае, когда вы решили использовать плагин `ldap`.

```yaml
auth:
  activedirectory:
    url: "ldap://10.0.100.1"
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Несколько плагинов аутентификации

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

### Конфигурирование middleware

Это пример того, как надо настраивать middleware-плагин. Все middleware-плагины должны быть определены в секции **middlewares**.

```yaml
middlewares:
  audit:
    enabled: true
```

> В качестве примера, можно посмотреть на [middleware-плагин для audit](https://github.com/verdaccio/verdaccio-audit).

### Конфигрирование хранилища

Это пример того, как нужно настраивать плагин хранилища. Все плагины хранилища должны быть определены в секции **store**.

```yaml
store:
  memory:
    limit: 1000
```

### Конфигурирование UI темы

Verdaccio позволяет заменить веб-интерфейс, и мы называем это **UI темой**. По умолчанию, используется `@verdaccio/ui-theme`, который включен в поставку, но вы можете использовать что-нибудь другое, установив свой плагин.

```bash

$> npm install --global verdaccio-theme-dark

```

> Имя плагина должно начинаться с `verdaccio-theme`, иначе плагин не будет загружен.


You can load only one theme at a time and pass through options if you need it.

```yaml
theme:
  dark:
    option1: foo
    option2: bar
```

## Устаревшие плагины

### Плагины Sinopia

> Если вы используете плагин sinopia, помните, что все они - deprecated и могут перестать работать в будущем.

* [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): плагин аутентификации для sinopia, поддерживающий репозиторий npm.
* [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): плагин аутентификации для sinopia, который хранит пользователей в памяти.
* [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
* [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): плагин аутентификации для sinopia, для поддержки atlassian crowd.
* [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): плагин аутентификации для sinopia, для поддержки Active Directory.
* [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): плагин аутентификации для sinopia2, для поддержки github oauth web flow.
* [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): плагин аутентификации для sinopia, который делегирует аутентификацию по другому HTTP URL
* [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): альтернативный плагин аутентификации для sinopia, для поддержки LDAP
* [sinopia-request](https://www.npmjs.com/package/sinopia-request): плагин аутентификации для аутентификации через внешнее API.
* [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Генерирует пароль в формате htaccess, шифрует с помощью GPG и посылает его пользователям через MailGun API.
* [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): плагин аутентификации, использует mongodb.
* [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): плагин аутентификации для sinopia, поддерживает формат htpasswd.
* [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): плагин аутентификации для sinopia, использует leveldb.
* [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): плагин аутентификации для sinopia, использует Gitlab.
* [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): плагин аутентификации для sinopia, использует Gitlab
* [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): плагин аутентификации для sinopia, использует LDAP.
* [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) плагин аутентификации для sinopia, использует github oauth web flow.

> Все плагины sinopia совместимы со всеми будущими версиями verdaccio. Тем не менее, мы очень хотели бы, чтобы контрибьюторы мигрировали на современный verdaccio API и использовали префикс *verdaccio-xx-name*.

