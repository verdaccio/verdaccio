---
id: notifications
title: "Notificaciones"
---
Notify was built primarily to use with Slack's Incoming webhooks, but will also deliver a simple payload to any endpoint. Currently only active for `npm publish` command.

## Uso

An example with a **HipChat**, **Stride** and **Google Hangouts Chat** hook:

> Verdaccio supports any API, feel free to ad more examples.

#### Notificación sencilla

```yaml
notify:
  method: POST
  headers: [{'Content-Type': 'application/json'}]
  endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
  content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
```

#### Múltiples notificaciones

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

## Template

We use [Handlebars](https://handlebarsjs.com/) as main template engine.

### Format Examples

    # iterate all versions
    {{ name }}{{#each versions}} v{{version}}{{/each}}`"}
    
    # publisher and `dist-tag` package published
    {{ publisher.name }} has published {{publishedPackage}}"}
    

### Properties

List of properties accesible via template

* Metadata
* Publisher (who is publishing)
* Package Published (package@1.0.0)

### Metadata

Package metadata that the template has access

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

You can access to the package publisher information in the `content` of a webhook using the `publisher` object.

See below the `publisher` object type:

    {
      name: string,
      groups: string[],
      real_groups: string[]
    }
    

An example:

    notify:
      method: POST
      headers: [{'Content-Type': 'application/json'}]
      endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
      content: '{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
    

**Note:** it's not possible to get the publisher information if the `package.json` file already has the `publisher` property.

### Package Published

You can acces to the package is being published with the keyword `{{publishedPackage}}` as follows.

    {{ publisher.name }} has published {{publishedPackage}}"}
    

## Configuration

| Propiedad           | Tipo         | Requerido | Soporte | Por Defecto | Descripción                                                                                  |
| ------------------- | ------------ | --------- | ------- | ----------- | -------------------------------------------------------------------------------------------- |
| method              | string       | No        | all     |             | HTTP verb                                                                                    |
| packagePattern      | string       | No        | all     |             | Solo ejecutar esta notificación si el nombre del paquete coincide con la expresión regular   |
| packagePatternFlags | string       | No        | all     |             | Any flags to be used with the regular expression                                             |
| headers             | array/object | Yes       | all     |             | Si el endpoint requiere encabezados específicos, defínelos aquí como un arreglo (key:value). |
| endpoint            | string       | Yes       | all     |             | define el URL para el endpoint                                                               |
| content             | string       | Yes       | all     |             | any [Handlebar](https://handlebarsjs.com/) expressions                                       |