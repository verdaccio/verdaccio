---
id: packages
title: "Доступ к пакетам"
---

This is a series of constraints that allow or restrict access to the local storage based on specific criteria.

Ограничения реализуются плагинами, по умолчанию `verdaccio` использует [плагин htpasswd](https://github.com/verdaccio/verdaccio-htpasswd). Если вы используете другой плагин, то детали могут отличаться. Плагин по умолчанию не реализует `allow_access` and `allow_publish`, использется встроенная реализация, которая включается именно в такой ситуации - когда плагин не реализовал эти методы.

Для более детальной информации о разрешениях, обратитесь к [странице аутентификации в вики](auth.md).

### Использование

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: $all
    publish: $all
    proxy: server2

  'private-*':
    access: $all
    publish: $all
    proxy: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    access: $all
    publish: $all
    proxy: uplink2
```

если не задано никаких правил, остается правило по умолчанию

```yaml
packages:
  '**':
    access: $all
    publish: $authenticated
```

Вот список внутренних групп, используемых `verdaccio`:

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

Все пользователи получают этот набор групп, независимо от того, аутентифицированы они или нет, плюс группы из плагина, в случае плагина `htpasswd` он вернет имя пользователя в качестве группы. Например, если вы залогинились как `npmUser`, у вас будут вот такие группы.

```js
// группы без '$' будут отмечены как deprecated когда-нибудь
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Если вы хотите разрешить доступ к некоторому набору пакетов только членам своей группы, вам нужно делать так. Давайте будем использовать `regex`, который выберет все пакеты с префиксом `npmuser-`. Мы рекомендем использовать префикс для ваших пакетов, так проще всего настраивать разграничение прав.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Перезапустите `verdaccio` и попробуйте установить `npmuser-core` через консоль.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Вы можете изменить описанное поведение, используя другой плагин аутентификации. `verdaccio` всего лишь проверяет, входит ли пользователь, который пытается загрузить или опубликовать пакет, в правильную группу.

Please note that if you set the `access` permission of a package to something that requires Verdaccio to check your identity, for example `$authenticated`, npm does not send your access key by default when fetching packages. This means all requests for downloading packages will be rejected as they are made anonymously even if you have logged in. To make npm include you access key with all requests, you should set the [always-auth](https://docs.npmjs.com/cli/v7/using-npm/config#always-auth) npm setting to true on any client machines. This can be accomplished by running:

```bash
$ npm config set always-auth=true
```

#### Установка нескольких групп

Defining multiple access groups is fairly easy, just define them with a white space between them.

```yaml
  'company-*':
    access: admin internal
    publish: admin
    proxy: server1
  'supersecret-*':
    access: secret super-secret-area ultra-secret-area
    publish: secret ultra-secret-area
    proxy: server1
```

#### Блокировка доступа к набору пакетов

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Запрещение проксирования для набора пакетов

You might want to block one or several packages from fetching from remote repositories., but, at the same time, allow others to access different *uplinks*.

Let's see the following example:

```yaml
packages:
  'jquery':
    access: $all
    publish: $all
  'my-company-*':
    access: $all
    publish: $authenticated
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

Let's describe what we want with the above example:

* Я хочу хранить свой собственный пакет `jquery`, и мне нужно запретить проксирование для него.
* Я хочу хранить пакеты, удовлетворяющие паттерну `my-company-*`, и мне нужно запретить проксирование для них.
* Я хочу хранить пакеты из скоупа `my-local-scope`, и мне нужно запретить проксирование для них.
* Я хочу проксирование для всех остальных пакетов.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

#### Use multiple uplinks

You may assign multiple uplinks for use as a proxy to use in the case of failover, or where there may be other private registries in use.

```yaml
'**':
  access: $all
  publish: $authenticated
  proxy: npmjs uplink2
```

#### Удаление опубликованных пакетов

The property `publish` handle permissions for `npm publish` and `npm unpublish`.  But, if you want to be more specific, you can use the property `unpublish` in your package access section, for instance:

```yalm
packages:
  'jquery':
    access: $all
    publish: $all
    unpublish: root
  'my-company-*':
    access: $all
    publish: $authenticated
    unpublish:
  '@my-local-scope/*':
    access: $all
    publish: $authenticated
    # unpublish: property commented out
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

In the previous example, the behaviour would be described:

* все пользователи могут публиковать пакет `jquery`, но только пользователь `root` может удалять любые версии.
* только аутентифицированные пользователи могут публиковать покаты `my-company-*`, но **никто не может удалять их**.
* Если `unpublish` закомментировать, то доступ будет определяяться свойством `publish`.


### Конфигурация

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Свойство | Тип    | Обязательное | Пример         | Поддержка      | Описание                                                   |
| -------- | ------ | ------------ | -------------- | -------------- | ---------------------------------------------------------- |
| access   | string | Нет          | $all           | все            | определяет группы, которым можно скачать этот пакет        |
| publish  | string | Нет          | $authenticated | все            | определяет группы, которым можно публиковать этот пакет    |
| proxy    | string | Нет          | npmjs          | все            | определяет аплинки для этого пакета                        |
| storage  | string | Нет          | string         | `/some-folder` | определяет подпапку в хранилище для этого пакета (пакетов) |

> Хочется отдельно отметить, что мы рекомендуем не использовать **allow_access**/**allow_publish** и **proxy_access**, они - deprecated и скоро будут удалены, пожалуйста, используйте короткие версии (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).
