---
id: webui
title: Web User Interface
---
Verdaccio contiene una interfaz web para mostrar paquetes privados, puede ser personalizable.

```yaml
web:
  enable: true
  title: Verdaccio
  logo: logo.png
```

### Configuración

| Propiedad | Tipo    | Requerido | Ejemplo                        | Soporte | Descripcion                          |
| --------- | ------- | --------- | ------------------------------ | ------- | ------------------------------------ |
| enable    | boolean | No        | true/false                     | all     | habilita la interfaz web             |
| title     | string  | No        | $authenticated                 | all     | El título de la interfaz web         |
| logo      | string  | No        | http://my.logo.domain/logo.png | all     | el URI donde el logo esta localizado |