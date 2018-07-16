---
id: 记录器
title: "记录器"
---
和任何网页应用程序一样， verdaccio 有自定义的内置记录器。您可以定义多种输出类型。

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
```

Use `SIGUSR2` to notify the application, the log-file was rotated and it needs to reopen it.

### Configuration

| Property | Type   | Required | Example                                        | Support | Description                                       |
| -------- | ------ | -------- | ---------------------------------------------- | ------- | ------------------------------------------------- |
| type     | string | No       | [stdout, file]                                 | all     | define the output                                 |
| path     | string | No       | verdaccio.log                                  | all     | if type is file, define the location of that file |
| format   | string | No       | [pretty, pretty-timestamped]                   | all     | output format                                     |
| level    | string | No       | [fatal, error, warn, http, info, debug, trace] | all     | verbose level                                     |