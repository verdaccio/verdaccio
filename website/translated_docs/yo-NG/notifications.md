---
id: awọn ifitonileti
title: "Awọn ifitonileti"
---

Notify was built primarily to use with Slack's Incoming webhooks, but will also deliver a simple payload to any endpoint. This is currently only active for the `npm publish` command.

## Ilo

Apẹẹrẹ kan pẹlu ikọ **HipChat**, **Stride** ati **Google Hangouts Chat**:

> Verdaccio n ṣe atilẹyin eyikeyi API, ma se siyemeji lati ṣafikun apẹẹrẹ diẹ sii.

#### Ifitonileti kan

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### Ifitonileti pupọ

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

## Awoṣe

A lo [Handlebars](https://handlebarsjs.com/) gẹgẹbi ẹrọ ti koko awoṣe.

### Awọn apẹẹrẹ Ọna

```
# iterate all versions
{{ name }}{{#each versions}} v{{version}}{{/each}}

# publisher and `dist-tag` package published
{{ publisher.name }} has published {{ publishedPackage }}
```

### Awọn ohun ini

Akojọ ti awọn ohun ini to ṣe wọle si nipasẹ awoṣe

* Mẹtadata
* Olugbejade (ẹniti o n ṣe agbejade)
* Akopọ to jẹ Gbigbejade (akopọ@1.0.0)

### Mẹtadata

Mẹtadata akopọ ti awoṣe naa ni iwọle si

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


### Olugbejade

You can get access to the package publisher information in the `content` of a webhook using the `publisher` object.

Wo labẹ yii `olugbejade` iru nkan:

```
{
  name: string,
  groups: string[],
  real_groups: string[]
}
```

Apẹẹrẹ kan:

```
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*. Orukọ olugbejade: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
```

**Akiyesi:** ko ṣe ṣee ṣe lati gba alaye olugbejade ti faili `package.json` ba ti ni ohun ini `olugbejade` tẹlẹ.

### Akopọ to ti jẹ Gbigbejade

O le wọle si akopọ ti o n jẹ gbigbe jade pẹlu koko-ọrọ `{{publishedPackage}}` bi atẹle yi.

```
{{ publisher.name }} ti ṣe agbejade {{ publishedPackage }}
```

## Iṣeto

| Ohun ini            | Iru        | Ti o nilo | Atilẹyin | Atilẹwa | Apejuwe                                                                                                |
| ------------------- | ---------- | --------- | -------- | ------- | ------------------------------------------------------------------------------------------------------ |
| ọna                 | okun       | Rara      | gbogbo   |         | HTTP verb                                                                                              |
| packagePattern      | okun       | Rara      | gbogbo   |         | Mu ifitonileti yi ṣiṣẹ nikan ti o ba jẹ pe orukọ akopọ naa ba ni ibaamu pẹlu iṣafihan deede            |
| packagePatternFlags | okun       | Rara      | gbogbo   |         | Awọn asia eyikeyi to ba ma jẹ lilo pẹlu iṣafihan deede                                                 |
| awọn akọle          | array/nkan | Bẹẹni     | gbogbo   |         | Ti aaye opin yii ba nilo awọn akọle pato, ṣeto wọn nibi gẹgẹbi oriṣi eto ti bọtini: awọn nkan iyebiye. |
| aaye opin           | okun       | Bẹẹni     | gbogbo   |         | ṣeto aaye opin ti URL naa fun ipe yii                                                                  |
| akoonu              | okun       | Bẹẹni     | gbogbo   |         | eyikeyi awọn isafihan [Handlebar](https://handlebarsjs.com/)                                           |
