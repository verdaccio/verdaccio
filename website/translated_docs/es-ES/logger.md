---
id: logger
title: "Registrador"
---
Como cualquier aplicación web, verdaccio tiene un registrador personalizable integrado. Puedes definir varios tipos de salidas.

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
```

Usa `SIGUSR2` para notificar a la aplicación, el archivo de registro fue rotado y necesita reabrirlo.

### Configuración

| Propiedad | Tipo   | Requerido | Ejemplo                                        | Soporte | Descripción                                               |
| --------- | ------ | --------- | ---------------------------------------------- | ------- | --------------------------------------------------------- |
| type      | string | No        | [stdout, file]                                 | todos   | define la salida                                          |
| path      | string | No        | verdaccio.log                                  | todos   | si el tipo es archivo, define la ubicación de ese archivo |
| format    | string | No        | [pretty, pretty-timestamped]                   | todos   | formato de salida                                         |
| level     | string | No        | [fatal, error, warn, http, info, debug, trace] | todos   | nivel verboso                                             |