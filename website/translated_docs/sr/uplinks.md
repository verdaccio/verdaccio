---
id: uplinks
title: "Uplinks"
---

An *uplink* is a link with an external registry that provides access to external packages.

![Uplinks](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

<div id="codefund">''</div>

### Коришћење

```yaml
uplinks:
  npmjs:
   url: https://registry.npmjs.org/
  server2:
    url: http://mirror.local.net/
    timeout: 100ms
  server3:
    url: http://mirror2.local.net:9000/
  baduplink:
    url: http://localhost:55666/
```

### Конфигурисање

You can define mutiple uplinks and each of them must have an unique name (key). They can have the following properties:

| Својство      | Тип     | Неопходно | Пример                                 | Подршка  | Опис                                                                                                                                                                     | Подразумевано     |
| ------------- | ------- | --------- | -------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| url           | string  | Да        | https://registry.npmjs.org/            | all      | Url registry-а                                                                                                                                                           | npmjs             |
| ca            | string  | Не        | ~./ssl/client.crt'                     | all      | Пут до SSL сертификата                                                                                                                                                   | Нема ништа задато |
| timeout       | string  | Не        | 100ms                                  | all      | подесите нови timeout за request                                                                                                                                         | 30s               |
| maxage        | string  | Не        | 10m                                    | all      | the time threshold to the cache is valid                                                                                                                                 | 2m                |
| fail_timeout  | string  | Не        | 10m                                    | all      | дефинише максимално време након којег захтев постаје неуспешан                                                                                                           | 5m                |
| max_fails     | number  | Не        | 2                                      | all      | лимитира максимални број неуспелих захтева                                                                                                                               | 2                 |
| cache         | boolean | Не        | [true,false]                           | >= 2.1   | кеширање свих tarballs из storage-а                                                                                                                                      | true              |
| auth          | list    | Не        | [види испод](uplinks.md#auth-property) | >= 2.5   | додељује заглавље 'Authorization' [више информација](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules)                                         | онемогућено       |
| headers       | list    | Не        | ауторизација: "Bearer SecretJWToken==" | all      | листа корисничких, прилагођених заглавља за uplink                                                                                                                       | онемогућено       |
| strict_ssl    | boolean | Не        | [true,false]                           | > = 3.0  | If true, захтева да SSL сертификат буде валидан.                                                                                                                         | true              |
| agent_options | object  | Не        | maxSockets: 10                         | >= 4.0.2 | options for the HTTP or HTTPS Agent responsible for managing uplink connection persistence and reuse [more info](https://nodejs.org/api/http.html#http_class_http_agent) | Нема ништа задато |

#### Auth property

Својство `auth` Вам омогућава да користите auth токен за uplink. Користите подразумевану environment варијаблу:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`
```

или преко дефинисане environment варијабле:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN`за интерну употребу користи `process.env['FOO_TOKEN']`

или је директно дефинисано токеном:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Напомена: `token` има приоритет над `token_env`

### Ваљало би знати

* Uplinks морају бити registries компатибилни са `npm` endpoints. Пример: *verdaccio*, `sinopia@1.4.0`, *npmjs registry*, *yarn registry*, *JFrog*, *Nexus* и тако даље.
* Подешавање `cache` на false, помоћи ће да се уштеди простор на хард диску. Тако се избегава чување `tarballs-а` али [ће metadata бити чувани у фолдерима](https://github.com/verdaccio/verdaccio/issues/391).
* Претеривање са uplinks може успорити lookup Ваших packages-а јер сваки пут када npm client тражи захтев, verdaccio прави 1 повезивање за сваки uplink.
* Формат за (timeout, maxage и fail_timeout) је усклађен са [NGINX јединицама мере](http://nginx.org/en/docs/syntax.html)