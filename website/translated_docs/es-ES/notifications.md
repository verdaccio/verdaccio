---
id: notifications
title: "Notificaciones"
---
Notify fué creado principalmente para usarse con los webhooks entrantes de Slack, pero también entregará una carga útil simple a cualquier endpoint. Actualmente sólo está activo para el comando `npm publish`.

## Uso

Un ejemplo con un hook de **HipChat**, **Stride** y **Google Hangouts Chat**:

> Verdaccio soporta cualquier API, siéntase en libertad de añadir más ejemplos.

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

## Modelo

Usamos [Handlebars](https://handlebarsjs.com/) como el motor del modelo principal.

### Ejemplos de Formato

    # iterar todas las versiones
    {{ name }}{{#each versions}} v{{version}}{{/each}}`"}
    
    # publisher y el paquete `dist-tag` publicado
    {{ publisher.name }} has published {{publishedPackage}}"}
    

### Propiedades

Lista de las propiedades accesibles mediante el modelo

* Metadata
* Publisher (quién está publicando)
* Paquete Publicado (package@1.0.0)

### Metadata

Paquete de metadata a la que el modelo tiene acceso

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

Puede acceder a la información del paquete publisher en el `content` de una webhook usando el objeto `publisher`.

Vea a continuación el tipo de objeto `publisher`:

    {
      name: string,
      groups: string[],
      real_groups: string[]
    }
    

Un ejemplo:

    notify:
      method: POST
      headers: [{'Content-Type': 'application/json'}]
      endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
      content: '{"color":"green","message":"New package published: * {{ name }}*. Publisher name: * {{ publisher.name }} *.","notify":true,"message_format":"text"}'
    

**Nota:** no es posible obtener la información de publisher si el archivo `package.json` ya tiene la propiedad `publisher`.

### Paquete Publicado

Puede acceder al paquete que está siendo publicado con el comando `{{publishedPackage}}` como a continuación.

    {{ publisher.name }} has published {{publishedPackage}}"}
    

## Configuración

| Propiedad           | Tipo         | Requerido | Soporte | Por Defecto | Descripción                                                                                  |
| ------------------- | ------------ | --------- | ------- | ----------- | -------------------------------------------------------------------------------------------- |
| method              | string       | No        | all     |             | HTTP verb                                                                                    |
| packagePattern      | string       | No        | all     |             | Solo ejecutar esta notificación si el nombre del paquete coincide con la expresión regular   |
| packagePatternFlags | string       | No        | all     |             | Cualquier bandera para ser usada con la expresión regular                                    |
| headers             | array/object | Yes       | all     |             | Si el endpoint requiere encabezados específicos, defínelos aquí como un arreglo (key:value). |
| endpoint            | string       | Yes       | all     |             | define el URL para el endpoint                                                               |
| content             | string       | Yes       | all     |             | cualquier expresión [Handlebar](https://handlebarsjs.com/)                                   |