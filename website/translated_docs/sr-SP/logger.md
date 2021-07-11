---
id: logger
title: "Logger"
---

As with any web application, Verdaccio has a customisable built-in logger. You can define multiple types of outputs.

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

### Конфигурисање

| Својство | Тип    | Неопходно | Пример                                         | Подршка | Опис                                       |
| -------- | ------ | --------- | ---------------------------------------------- | ------- | ------------------------------------------ |
| type     | string | Не        | [stdout, file]                                 | all     | дефинише излаз                             |
| path     | string | Не        | verdaccio.log                                  | all     | ако је тип "фајл", дефинише локацију фајла |
| format   | string | Не        | [pretty, pretty-timestamped]                   | all     | излазни формат                             |
| level    | string | Не        | [fatal, error, warn, http, info, debug, trace] | all     | verbose level                              |
