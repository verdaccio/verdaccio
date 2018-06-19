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

Usa `SIGUSR2` para notificar a la aplicación, el archivo de registro fue girado y necesita reabrirlo.

### Configuración

| Property | Tipo                 | Requerido | Ejemplo                                        | Support | Descripción                                       |
| -------- | -------------------- | --------- | ---------------------------------------------- | ------- | ------------------------------------------------- |
| type     | cadena de caracteres | No        | [stdout, file]                                 | todos   | define la salida                                  |
| path     | cadena de caracteres | No        | verdaccio.log                                  | todos   | if type is file, define the location of that file |
| format   | cadena de caracteres | No        | [pretty, pretty-timestamped]                   | todos   | formato de salida                                 |
| level    | cadena de caracteres | No        | [fatal, error, warn, http, info, debug, trace] | todos   | verbose level                                     |