---
id: logger
title: "Логи"
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

### Конфигурация

| Свойство | Тип    | Обязательное | Пример                                         | Поддержка | Описание                                            |
| -------- | ------ | ------------ | ---------------------------------------------- | --------- | --------------------------------------------------- |
| type     | string | Нет          | [stdout, file]                                 | все       | определяет устройство вывода                        |
| path     | string | Нет          | verdaccio.log                                  | все       | если type - это файл, то местоположение этого файла |
| format   | string | Нет          | [pretty, pretty-timestamped]                   | все       | форматирование выходных данных                      |
| level    | string | Нет          | [fatal, error, warn, http, info, debug, trace] | все       | уровень подробности логов                           |
