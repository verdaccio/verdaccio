---
id: webui
title: "Web User Interface2"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio has a web user interface to display only the private packages and can be customisable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

All access restrictions defined to [protect your packages](protect-your-dependencies.md) will also apply to the Web Interface.

### Configuración

| Propiedad | Tipo    | Requerido | Ejemplo                        | Soporte | Descripcion                                                                                                                                          |
| --------- | ------- | --------- | ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| enable    | boolean | No        | true/false                     | all     | habilita la interfaz web                                                                                                                             |
| title     | string  | No        | Verdaccio                      | all     | El título de la interfaz web                                                                                                                         |
| logo      | string  | No        | http://my.logo.domain/logo.png | all     | el URI donde el logo esta localizado                                                                                                                 |
| scope     | string  | No        | \\@myscope                   | all     | If you're using this registry for a specific module scope, specify that scope to set it in the webui instructions header (note: escape @ with \\@) |