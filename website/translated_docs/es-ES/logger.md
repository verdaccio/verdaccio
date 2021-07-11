---
id: logger
title: "Registrador"
---

Como cualquier aplicación web, verdaccio tiene un registrador personalizable integrado. Puedes definir varios tipos de salidas.

```yaml
# console output
logs: { type: stdout, format: pretty, level: http }
```

or file output.

```yaml
# file output
logs: { type: file, path: verdaccio.log, level: info }
```

> Verdaccio 5 does not support rotation file anymore, [here more details](https://verdaccio.org/blog/2021/04/14/verdaccio-5-migration-guide#pinojs-is-the-new-logger).

Use `SIGUSR2` to notify the application, the log-file was rotated and it needs to reopen it. Note: Rotating log stream is not supported in cluster mode. [See here](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

### Configuración

| Propiedad | Tipo   | Requerido | Ejemplo                                        | Soporte | Descripción                                               |
| --------- | ------ | --------- | ---------------------------------------------- | ------- | --------------------------------------------------------- |
| tipo      | string | No        | [stdout, file]                                 | all     | define la salida                                          |
| path      | string | No        | verdaccio.log                                  | all     | si el tipo es archivo, define la ubicación de ese archivo |
| format    | string | No        | [pretty, pretty-timestamped]                   | all     | formato de salida                                         |
| level     | string | No        | [fatal, error, warn, http, info, debug, trace] | all     | nivel verboso                                             |
