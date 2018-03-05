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

| Propiedad           | Tipo         | Requerido | Soporte | Por Defecto | Descripción                                                                                  |
| ------------------- | ------------ | --------- | ------- | ----------- | -------------------------------------------------------------------------------------------- |
| method              | string       | No        | all     |             | HTTP verb                                                                                    |
| packagePattern      | string       | No        | all     |             | Solo ejecutar esta notificación si el nombre del paquete coincide con la expresión regular   |
| packagePatternFlags | string       | No        | all     |             | Any flags to be used with the regular expression                                             |
| headers             | array/object | Yes       | all     |             | Si el endpoint requiere encabezados específicos, defínelos aquí como un arreglo (key:value). |
| endpoint            | string       | Yes       | all     |             | define el URL para el endpoint                                                               |
| content             | string       | Yes       | all     |             | una plantilla en Handlebars                                                                  |