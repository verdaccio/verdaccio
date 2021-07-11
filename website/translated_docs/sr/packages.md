---
id: packages
title: "Package Access"
---

Ово је серија контејнера која дозвољава или забрањује приступ до local storage на основу специфично дефинисаних критеријума.

Сигурност пада на плећа plugina који се користи. По правилу, `verdaccio` користи [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). Ако користите различит plugin, начин извршавања (behaviour) би такође могао бити промењен. Подразумевани plugin не руководи (handle) са `allow_access` и `allow_publish` самостално, већ користи интерни fallback у случају да не постоји спремни plugin.

<div id="codefund">''</div>

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

#### Подешавање мултиплих група

Дефинисање multiple access groups је релативно једноставно, само је потребно да их дефинишете са размаком између.

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
  '**':
    access: $all
    publish: $authenticated
```

#### Блокирање proxying-а за сет специфичних пакета

Можда ћете пожелети да блокирате један или више пакета од ухваћених (fetching) из удаљеног репозиторијума, али да истовремено дозволите другима да приступе различитим *uplinks-има*.

Хајде да погледамо пример:

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

Хајде да видимо шта смо постигли у наведеном примеру:

* Желим да хостујем свој `jquery` dependency али истовремено желим да избегнем њено proxying-овање.
* Желим све dependencies које се поклапају са `my-company-*` али уједно имам потребу да избегнем њихово proxying-овање.
* Желим све dependencies које су у `my-local-scope` али уједно желим да избегнем њихово proxying-овање.
* Желим да proxying-ујем све остале dependencies.

**Будите свесни тога да је редослед дефинисања Ваших пакета важан, и још нешто, увек користите double wilcard**. Јер ако не будете тога свесни, `verdaccio` ће то учинити уместо Вас, што ће утицати Ваше dependencies.

#### Unpublishing Packages

The property `publish` handle permissions for `npm publish` and `npm unpublish`. But, if you want to be more specific, you can use the property `unpublish` in your package access section, for instance:

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

Можете дефинисати мултипле `packages` при чему сваки од њих мора имати јединствени `Regex`. Синтакса је базирана на [minimatch glob expressions](https://github.com/isaacs/minimatch).

| Својство | Тип    | Неопходно | Пример         | Подршка        | Опис                                                                |
| -------- | ------ | --------- | -------------- | -------------- | ------------------------------------------------------------------- |
| access   | string | Не        | $all           | all            | дефинише групе којима је дозвољен приступ пакету                    |
| publish  | string | Не        | $authenticated | all            | дефинише групе којима је дозвољено да публикују                     |
| proxy    | string | Не        | npmjs          | all            | лимитира look ups за специфични uplink                              |
| storage  | string | Не        | string         | `/some-folder` | креира под-фолдер унутрар storage фолдера за сваки приступ пакетима |

> Наглашавамо да не препоручујемо да и даље користите **allow_access**/**allow_publish** и **proxy_access**, јер ће наведене ускоро бити уклоњене. Молимо Вас да уместо тога користите скраћене верзије (**access**/**publish**/**proxy**).

If you want more information about how to use the **storage** property, please refer to this [comment](https://github.com/verdaccio/verdaccio/issues/1383#issuecomment-509933674).