---
id: logger
title: 'Logger'
---

:::info

Since v5.22.0 the logger property is renamed from `logs` to `log`, but still compatible with v6 but not recommended to use, could be removed any time.

:::

As with any web application, Verdaccio has a customizable built-in logger. You can define multiple types of outputs.

```yaml
# console output
log: { type: stdout, format: pretty, level: http }
```

or file output.

```yaml
# file output
log: { type: file, path: verdaccio.log, level: info }
```

> Verdaccio 5 does not support rotation file anymore, [here more details](https://verdaccio.org/blog/2021/04/14/verdaccio-5-migration-guide#pinojs-is-the-new-logger).

Use `SIGUSR2` to notify the application, the log-file was rotated and it needs to reopen it.
Note: Rotating log stream is not supported in cluster mode. [See here](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

Sensitive data can be masked or removed using [log redaction](https://getpino.io/#/docs/redaction).

```yaml
log:
  type: stdout
  format: pretty
  level: http
  redact:
    paths:
      [
        'req.header.authorization',
        'req.header.cookie',
        'req.remoteAddress',
        'req.remotePort',
        'ip',
        'remoteIP',
        'user',
        'msg',
      ]
    censor: '<redacted>'
```

### Configuration {#configuration}

| Property | Type    | Required | Example                                        | Support | Description                                       |
| -------- | ------- | -------- | ---------------------------------------------- | ------- | ------------------------------------------------- |
| type     | string  | No       | [stdout, file]                                 | all     | define the output                                 |
| path     | string  | No       | verdaccio.log                                  | all     | if type is file, define the location of that file |
| format   | string  | No       | [pretty, pretty-timestamped]                   | all     | output format                                     |
| level    | string  | No       | [fatal, error, warn, info, http, debug, trace] | all     | verbose level                                     |
| colors   | boolean | No       | false                                          | v5.7.0  | disable or enable colors                          |
| redact   | object  | No       | see above                                      |         | redact sensitive data                             |
| sync     | boolean | No       | true                                           |         | turn on synchronous logging                       |
