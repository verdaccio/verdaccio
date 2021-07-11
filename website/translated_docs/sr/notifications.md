---
id: нотификације
title: "Нотификације"
---

Нотификације су замишљене да се користе са Slack's Incoming webhooks, али такође испоручују simple payload до било које endpoint. Тренутно је активно једино за `npm publish` команду.

<div id="codefund">''</div>

## Коришћење

На пример са **HipChat**, **Stride** и **Google Hangouts Chat** hook:

> Verdaccio supports any API, feel free to add more examples.

#### Јединствена нотификација

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### Вишеструка нотификација

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

## Темплат

Користимо [Handlebars](https://handlebarsjs.com/) као main template engine.

### Примери за формате

    # Пролази кроз све верзије
    {{ name }}{{#each versions}} v{{version}}{{/each}}
    
    # publisher и `dist-tag` package published
    {{ publisher.name }} has published {{ publishedPackage }}
    

### Својства (Properties)

Листа својстава којима се може приступити преко темплата

* Metadata
* Publisher (онај који публикује)
* Package Published (package@1.0.0)

### Metadata

Package metadata за које темплат има приступ

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
    

### Publisher

Можете приступити package publisher информацијама у `content` у оквиру webhook користећи `publisher` објекат.

Погледајте пример за `publisher` object type:

    {
      name: string,
      groups: string[],
      real_groups: string[]
    }
    

Пример:

    notify:
      method: POST
      headers: [{'Content-Type': 'application/json'}]
      endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
      content: '{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
    

**Напомена:** Није могуће добити publisher information ако `package.json` фајл већ има `publisher` својство.

### Package Published

Можете приступити опцији package is being published помоћу кључне речи `{{publishedPackage}}` на следећи начин.

    {{ publisher.name }} has published {{ publishedPackage }}
    

## Конфигурисање

| Својство            | Тип          | Неопходно | Подршка | Подразумевано | Опис                                                                                           |
| ------------------- | ------------ | --------- | ------- | ------------- | ---------------------------------------------------------------------------------------------- |
| method              | string       | Не        | all     |               | HTTP verb                                                                                      |
| packagePattern      | string       | Не        | all     |               | Покрени ову нотификацију ако се име пакета подудара са регуларним изразом (regular expression) |
| packagePatternFlags | string       | Не        | all     |               | Било која заставица (flags) која ће се користити са regular expression                         |
| headers             | array/object | Да        | all     |               | Ако endpoint захтева specific headers, подесите их овде као array of key: value objects.       |
| endpoint            | string       | Да        | all     |               | подесите URL endpoint за овај позив                                                            |
| content             | string       | Да        | all     |               | било који [Handlebar](https://handlebarsjs.com/) expressions                                   |