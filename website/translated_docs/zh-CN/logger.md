---
id: 记录器
title: "记录器"
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

### 配置

| 属性     | 类型     | 必填 | 范例                                             | 支持  | 描述                |
| ------ | ------ | -- | ---------------------------------------------- | --- | ----------------- |
| type   | string | No | [stdout, file]                                 | all | 定义输出              |
| path   | string | No | verdaccio.log                                  | all | 如果类型为文件，请定义该文件的位置 |
| format | string | No | [pretty, pretty-timestamped]                   | all | 输出格式              |
| level  | string | No | [fatal, error, warn, http, info, debug, trace] | all | 详细级别              |