---
id: uplinks
title: "Аплинки"
---

*Аплинк* - это соединение с внешним репозиторием, через которое идет доступ к внешним пакетом.

![Аплинки](https://user-images.githubusercontent.com/558752/52976233-fb0e3980-33c8-11e9-8eea-5415e6018144.png)

### Использование

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

### Конфигурация

Вы можете определить несколько аплинков и каждый из них должен иметь уникальное имя (ключ). Они могут иметь следующие свойства:

| Свойство      | Тип     | Обязательное | Пример                                  | Поддержка | Описание                                                                                                                                                                 | По умолчанию |
| ------------- | ------- | ------------ | --------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| url           | string  | Да           | https://registry.npmjs.org/             | все       | URL репозитория                                                                                                                                                          | npmjs        |
| ca            | string  | Нет          | ~./ssl/client.crt'                      | все       | путь к сертификату SSL                                                                                                                                                   | нет значения |
| timeout       | string  | Нет          | 100ms                                   | все       | таймаут для запроса                                                                                                                                                      | 30s          |
| maxage        | string  | Нет          | 10m                                     | все       | временный порог валидности кэша                                                                                                                                          | 2m           |
| fail_timeout  | string  | Нет          | 10m                                     | все       | время, через которое непрошедший запрос считается неудачным                                                                                                              | 5m           |
| max_fails     | number  | Нет          | 2                                       | все       | максимальное количество недачных запросов                                                                                                                                | 2            |
| cache         | boolean | Нет          | [true,false]                            | >= 2.1    | кэшировать tar-файлы пакетов или нет                                                                                                                                     | true         |
| auth          | list    | Нет          | [см. ниже](uplinks.md#auth-property)    | >= 2.5    | хедер 'Authorization' [больше инфо](http://blog.npmjs.org/post/118393368555/deploying-with-npm-private-modules)                                                          | disabled     |
| headers       | list    | Нет          | authorization: "Bearer SecretJWToken==" | все       | список хедеров для аплинка                                                                                                                                               | disabled     |
| strict_ssl    | boolean | Нет          | [true,false]                            | >= 3.0    | если true, то SSL сертификат будет проверяться на валидность.                                                                                                            | true         |
| agent_options | object  | Нет          | maxSockets: 10                          | >= 4.0.2  | options for the HTTP or HTTPS Agent responsible for managing uplink connection persistence and reuse [more info](https://nodejs.org/api/http.html#http_class_http_agent) | нет значения |

#### Свойство Auth

Свойство `auth` позволяет вам использовать токен авторизации для аплинка. Используя переменную окружения по умолчанию:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: true # defaults to `process.env['NPM_TOKEN']`
```

или задав явно переменную окружения:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token_env: FOO_TOKEN
```

`token_env: FOO_TOKEN` verdaccio-сервер будет использовать `process.env['FOO_TOKEN']`

или напрямую указав токен:

```yaml
uplinks:
  private:
    url: https://private-registry.domain.com/registry
    auth:
      type: bearer
      token: "token"
```

> Заметьте: `token` имеет приоритет над `token_env`

### Вы должны знать

* Аплинки должны быть репозиториями, которые совместимы с `npm` по эндпоинтам. Например: *verdaccio*, `sinopia@1.4.0`, *репозиторий npmjs registry*, *репозиторий yarn*, *JFrog*, *Nexus* и другие.
* Установка `cache` в значение false позволит сохранить место на диске. Это позволит избежать хранения `tar-файлов`, но [сохранит метаданные пакетов](https://github.com/verdaccio/verdaccio/issues/391).
* Увеличение числа аплинков может замедлить поиск пакетов, так как для каждого запроса пакета через клиентскую часть менеджера пакетов, verdaccio делает по 1 запросу во все аплинки.
* Формат настроек (timeout, maxage and fail_timeout) следует документу [NGINX measurement units](http://nginx.org/en/docs/syntax.html)