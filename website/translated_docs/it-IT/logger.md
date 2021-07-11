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

### Configurazione

| Proprietà | Tipo    | Richiesto | Esempio                                        | Supporto | Descrizione                                           |
| --------- | ------- | --------- | ---------------------------------------------- | -------- | ----------------------------------------------------- |
| tipo      | stringa | No        | [stdout, file]                                 | tutti    | definire l'output                                     |
| percorso  | stringa | No        | verdaccio.log                                  | tutti    | se il tipo è file, definire la posizione di quel file |
| formato   | stringa | No        | [pretty, pretty-timestamped]                   | tutti    | formato dell'output                                   |
| livello   | stringa | No        | [fatal, error, warn, http, info, debug, trace] | tutti    | livello dettagliato                                   |
