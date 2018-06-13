---
id: notifications
title: "Notificaciones"
---
Las notificaciones fueron introducidas con la idea de usar webhooks para Slack, pero también se puede enviar un *payload* a cualquier endpoint. Actualmente solo activo para los comandos `publish` / `create`.

## Uso

An example with a **HipChat** and **Google Hangouts Chat** hook:

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

### Publisher information

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

## Configuración

| Propiedad           | Tipo         | Requerido | Soporte | Por Defecto | Descripción                                                                                  |
| ------------------- | ------------ | --------- | ------- | ----------- | -------------------------------------------------------------------------------------------- |
| method              | string       | No        | all     |             | HTTP verb                                                                                    |
| packagePattern      | string       | No        | all     |             | Solo ejecutar esta notificación si el nombre del paquete coincide con la expresión regular   |
| packagePatternFlags | string       | No        | all     |             | Any flags to be used with the regular expression                                             |
| headers             | array/object | Yes       | all     |             | Si el endpoint requiere encabezados específicos, defínelos aquí como un arreglo (key:value). |
| endpoint            | string       | Yes       | all     |             | define el URL para el endpoint                                                               |
| content             | string       | Yes       | all     |             | any [handlebar](https://handlebarsjs.com/) expressions                                       |