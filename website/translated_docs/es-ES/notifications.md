---
id: notifications
title: "Notificaciones"
---
Las notificaciones fueron introducidas con la idea de usar webhooks para Slack, pero también se puede enviar un *payload* a cualquier endpoint. Actualmente solo activo para los comandos `publish` / `create`.

## Uso

Un ejemplo con ** hipchat**:

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
  'example-package-1'
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
  'example-package-2'
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'
  'example-package-3'
     method: POST
     headers: [{'Content-Type': 'application/json'}]
     endpoint: https://usagge.hipchat.com/v2/room/3729485/notification?auth_token=mySecretToken
     content: '{"color":"green","message":"New package published: * {{ name }}*","notify":true,"message_format":"text"}'


```

## Configuración

| Property            | Type         | Required | Support | Default | Description                                                                                  |
| ------------------- | ------------ | -------- | ------- | ------- | -------------------------------------------------------------------------------------------- |
| method              | string       | No       | all     |         | HTTP verb                                                                                    |
| packagePattern      | string       | No       | all     |         | Only run this notification if the package name matches the regular expression                |
| packagePatternFlags | string       | No       | all     |         | Any flags to be used with the regular expression                                             |
| headers             | array/object | Yes      | all     |         | If this endpoint requires specific headers, set them here as an array of key: value objects. |
| endpoint            | string       | Yes      | all     |         | set the URL endpoint for this call                                                           |
| content             | string       | Yes      | all     |         | any Handlebar expressions                                                                    |