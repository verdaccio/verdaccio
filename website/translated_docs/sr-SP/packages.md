---
id: packages
title: "Package Access"
---

This is a series of constraints that allow or restrict access to the local storage based on specific criteria.

Сигурност пада на плећа plugina који се користи. По правилу, `verdaccio` користи [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). Ако користите различит plugin, начин извршавања (behaviour) би такође могао бити промењен. Подразумевани plugin не руководи (handle) са `allow_access` и `allow_publish` самостално, већ користи интерни fallback у случају да не постоји спремни plugin.

За више информација о дозволама, посетите [authentification секцију на wiki](auth.md).

### Коришћење

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

ако ништа није прецизирано, остаје како је подразумевано

```yaml
packages:
  '**':
    access: $all
    publish: $authenticated
```

The list internal groups handled by `verdaccio` are:

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

Сви корисници примају све наведено како би подесили овлашћења независно од тога јесу ли анонимна или више група није омогућено од стране плугина, а у случају да је тако `htpasswd` враћа username као групу. На пример, ако сте пријављени као `npmUser` листа група ће изгледати овако.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

Ако желите да заштитите специфични сет пакета у оквиру групе, потребно је да урадите овако нешто. Користимо `Regex` који покрива све `npmuser-` пакете са префиксима. Препоручујемо коришћење префикса за Ваше пакете, јер ћете их на тај начин лакше заштитити.

```yaml
packages:
  'npmuser-*':
    access: npmuser
    publish: npmuser
```

Рестартујте `verdaccio` и у својој конзоли пробајте да инсталирате `npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

Можете променити постојећи behaviour коришћењем различите plugin аутентификације. `verdaccio` проверава да ли корисник који је покушао да приступи неком пакету или публикује пакет припада исправној групи корисника.

Please note that if you set the `access` permission of a package to something that requires Verdaccio to check your identity, for example `$authenticated`, npm does not send your access key by default when fetching packages. This means all requests for downloading packages will be rejected as they are made anonymously even if you have logged in. To make npm include you access key with all requests, you should set the [always-auth](https://docs.npmjs.com/cli/v7/using-npm/config#always-auth) npm setting to true on any client machines. This can be accomplished by running:

```bash
$ npm config set always-auth=true
```

#### Подешавање мултиплих група

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

#### Блокирање приступа сету пакета

If you want to block the access/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
    access: $all
    publish: $authenticated
```

#### Блокирање proxying-а за сет специфичних пакета

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

* Желим да хостујем свој `jquery` dependency али истовремено желим да избегнем њено proxying-овање.
* Желим све dependencies које се поклапају са `my-company-*` али уједно имам потребу да избегнем њихово proxying-овање.
* Желим све dependencies које су у `my-local-scope` али уједно желим да избегнем њихово proxying-овање.
* Желим да proxying-ујем све остале dependencies.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

#### Use multiple uplinks

You may assign multiple uplinks for use as a proxy to use in the case of failover, or where there may be other private registries in use.

```yaml
'**':
  access: $all
  publish: $authenticated
  proxy: npmjs uplink2
```

#### Unpublishing Packages

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

* all users can publish the `jquery` package, but only the user `root` would be able to unpublish any version.
* only authenticated users can publish `my-company-*` packages, but **nobody would be allowed to unpublish them**.
* If `unpublish` is commented out, the access will be granted or denied by the `publish` definition.


### Конфигурисање

You can define mutiple `packages` and each of them must have an unique `Regex`. The syntax is based on [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Својство | Тип    | Неопходно | Пример         | Подршка        | Опис                                                                |
| -------- | ------ | --------- | -------------- | -------------- | ------------------------------------------------------------------- |
| access   | string | Не        | $all           | all            | дефинише групе којима је дозвољен приступ пакету                    |
| publish  | string | Не        | $authenticated | all            | дефинише групе којима је дозвољено да публикују                     |
| proxy    | string | Не        | npmjs          | all            | лимитира look ups за специфични uplink                              |
| storage  | string | Не        | string         | `/some-folder` | креира под-фолдер унутрар storage фолдера за сваки приступ пакетима |

> We higlight that we recommend to not use **allow_access**/**allow_publish** and **proxy_access** anymore, those are deprecated and will soon be removed, please use the short version of each of those (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).
