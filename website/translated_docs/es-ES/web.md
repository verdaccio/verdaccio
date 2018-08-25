---
id: webui
title: "Web User Interface2"
---


<p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

Verdaccio ofrece un interfaz web de usuario para mostrar solo los paquetes privados y puede ser personalizable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
  scope:
```

Todo los accesos restringidos definidos para [proteger paquetes](protect-your-dependencies.md) también aplican al interfaz web.

### Configuración

| Propiedad | Tipo    | Requerido | Ejemplo                        | Soporte | Descripcion                                                                                                                         |
| --------- | ------- | --------- | ------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| enable    | boolean | No        | true/false                     | all     | habilita la interfaz web                                                                                                            |
| title     | string  | No        | Verdaccio                      | all     | El título de la interfaz web                                                                                                        |
| logo      | string  | No        | http://my.logo.domain/logo.png | all     | el URI donde el logo esta localizado                                                                                                |
| scope     | string  | No        | \\@myscope                   | all     | Si estas usando el registro por un scope specifico, define el @scope en el encabezado de la interfaz web (note: escapa @ con \\@) |