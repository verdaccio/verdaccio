---
id: logger
title: "Logger"
---
Come ogni applicazione web, verdaccio ha un logger incorporato personalizzabile. Si possono definire vari tipi di output.

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
  # Rotating log stream. Options are passed directly to bunyan. See: https://github.com/trentm/node-bunyan#stream-type-rotating-file
  - {type: rotating-file, format: json, path: /path/to/log.jsonl, level: http, options: {period: 1d}}
```

Utilizzare `SIGUSR2` per notificare all'applicazione, il file-log è stato ruotato ed è necessario riaprirlo. Note: Rotating log stream is not supported in cluster mode. [See here](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

### Configuration

| Property | Type   | Required | Example                                        | Support | Description                                       |
| -------- | ------ | -------- | ---------------------------------------------- | ------- | ------------------------------------------------- |
| type     | string | No       | [stdout, file]                                 | all     | define the output                                 |
| path     | string | No       | verdaccio.log                                  | all     | if type is file, define the location of that file |
| format   | string | No       | [pretty, pretty-timestamped]                   | all     | output format                                     |
| level    | string | No       | [fatal, error, warn, http, info, debug, trace] | all     | verbose level                                     |