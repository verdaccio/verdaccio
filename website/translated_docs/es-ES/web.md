---
id: webui
title: "Interfaz Web de Usuario"
---


<p align="center"><img src="https://firebasestorage.googleapis.com/v0/b/jotadeveloper-website.appspot.com/o/verdaccio_long_video2.gif?alt=media&token=4d20cad1-f700-4803-be14-4b641c651b41"></p>

Verdaccio tiene una interfaz web de usuario que solo muetra paquetes privados y puede ser personalizable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

All access restrictions defined to [protect your packages](protect-your-dependencies.md) will also apply to the Web Interface.

### Configuración

| Propiedad | Tipo    | Requerido | Ejemplo                        | Soporte | Descripcion                          |
| --------- | ------- | --------- | ------------------------------ | ------- | ------------------------------------ |
| enable    | boolean | No        | true/false                     | all     | habilita la interfaz web             |
| title     | string  | No        | Verdaccio                      | all     | El título de la interfaz web         |
| logo      | string  | No        | http://my.logo.domain/logo.png | all     | el URI donde el logo esta localizado |