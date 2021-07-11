---
id: notifications
title: "Уведомления"
---

Notify was built primarily to use with Slack's Incoming webhooks, but will also deliver a simple payload to any endpoint. This is currently only active for the `npm publish` command.

## Использование

Пример использования с хуками **HipChat**, **Stride** и **Google Hangouts Chat**:

> Verdaccio поддерживает любое API, не стесняйтесь и добавляйте еще примеры.

#### Одиночное уведомление

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### Несколько уведомлений

```yaml
notify:
  'example-google-chat':
    method: POST
    headers: [{'Content-Type': 'application/json'}]
    endpoint: https://chat.googleapis.com/v1/spaces/AAAAB_TcJYs/messages?key=myKey&token=myToken
    content: '{"text":"New package published: `{{ name }}{{#each versions}} v{{version}}{{/each}}`"}'
  'example-hipchat':
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
  'example-stride':
     method: POST
     headers: [{'Content-Type': 'application/json'}, {'authorization': 'Bearer secretToken'}]
     endpoint: https://api.atlassian.com/site/{cloudId}/conversation/{conversationId}/message
     content: '{"body": {"version": 1,"type": "doc","content": [{"type": "paragraph","content": [{"type": "text","text": "New package published: * {{ name }}* Publisher name: * {{ publisher.name }}"}]}]}}'
```

## Шаблон

Мы используем [Handlebars](https://handlebarsjs.com/) в качестве движка шаблонов.

### Пример форматирования

```
# итерировать все версии
{{ name }}{{#each versions}} v{{version}}{{/each}}

# publisher and `dist-tag` package published
{{ publisher.name }} has published {{ publishedPackage }}
```

### Свойства

Список свойств, доступных в шаблонах

* Метаданные
* Публикатор (тот кто опубликовал)
* Опубликованный пакет (package@1.0.0)

### Метаданные

Метаданные пакета, к которым имеет доступ шаблон

```
{
    "_id": "@test/pkg1",
    "name": "@test/pkg1",
    "description": "",
    "dist-tags": {
        "beta": "1.0.54"
    },
    "versions": {
        "1.0.54": {
            "name": "@test/pkg1",
            "version": "1.0.54",
            "description": "some description",
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "keywords": [],
            "author": {
                "name": "Author Name",
                "email": "author@domain.com"
            },
            "license": "MIT",
            "dependencies": {
                "webpack": "4.12.0"
            },
            "readmeFilename": "README.md",
            "_id": "@ test/pkg1@1.0.54",
            "_npmVersion": "6.1.0",
            "_nodeVersion": "9.9.0",
            "_npmUser": {},
            "dist": {
                "integrity": "sha512-JlXWpLtMUBAqvVZBvH7UVLhXkGE1ctmXbDjbH/l0zMuG7wVzQ7GshTYvD/b5C+G2vOL2oiIS1RtayA/kKkTwKw==",
                "shasum": "29c55c52c1e76e966e706165e5b9f22e32aa9f22",
                "tarball": "http://localhost:4873/@test/pkg1/-/@test/pkg1-1.0.54.tgz"
            }
        }
    },
    "readme": "# test",
    "_attachments": {
        "@test/pkg1-1.0.54.tgz": {
            "content_type": "application/octet-stream",
            "data": "H4sIAAAAAAAAE+y9Z5PjyJIgOJ ...",
            "length": 33112
        }
    },
    "time": {}
}
```


### Публикатор

You can get access to the package publisher information in the `content` of a webhook using the `publisher` object.

Описание типа `publisher`:

```
{
  name: string,
  groups: string[],
  real_groups: string[]
}
```

Пример:

```
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
```

**Заметка:** невозможно получить информацию о публикаторе, если в файле `package.json` уже есть свойство `publisher`.

### Опубликованный пакет

Вы можете получить доступ к пакету, который был опубликован, с помощью ключевого слова `{{publishedPackage}}`, как это показано ниже.

```
{{ publisher.name }} has published {{ publishedPackage }}
```

## Конфигурация

| Свойство            | Тип          | Обязательное | Поддержка | По умолчанию | Описание                                                                                   |
| ------------------- | ------------ | ------------ | --------- | ------------ | ------------------------------------------------------------------------------------------ |
| method              | string       | Нет          | все       |              | HTTP метод                                                                                 |
| packagePattern      | string       | Нет          | все       |              | Запускает уведомление, только если имя пакета соответствует регэкспу                       |
| packagePatternFlags | string       | Нет          | все       |              | Флаги для регэкспа                                                                         |
| headers             | array/object | Да           | все       |              | Если эндпоинту нужны особенные хэдеры, укажите их здесь, в виде массива пар ключ-значение. |
| endpoint            | string       | Да           | все       |              | URL эндпоинта для вызова                                                                   |
| content             | string       | Да           | все       |              | любое [Handlebar](https://handlebarsjs.com/)-выражение                                     |
