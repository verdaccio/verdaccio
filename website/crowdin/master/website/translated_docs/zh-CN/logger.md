---
id: 记录器
title: "记录器"
---

和任何网页应用程序一样， verdaccio 有可自定义的内置记录器。您可以定义多种输出类型。

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
  # Rotating log stream. Options are passed directly to bunyan. See: https://github.com/trentm/node-bunyan#stream-type-rotating-file
  - {type: rotating-file, format: json, path: /path/to/log.jsonl, level: http, options: {period: 1d}}
```

Use `SIGUSR2` to notify the application, the log-file was rotated and it needs to reopen it. Note: Rotating log stream is not supported in cluster mode. [See here](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

### 配置

| 属性     | 类型     | 必填 | 范例                                             | 支持  | 描述                |
| ------ | ------ | -- | ---------------------------------------------- | --- | ----------------- |
| type   | string | No | [stdout, file]                                 | all | 定义输出              |
| path   | string | No | verdaccio.log                                  | all | 如果类型为文件，请定义该文件的位置 |
| format | string | No | [pretty, pretty-timestamped]                   | all | 输出格式              |
| level  | string | No | [fatal, error, warn, http, info, debug, trace] | all | 详细级别              |