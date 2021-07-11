---
id: enregistreur
title: "Enregistreur"
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

### Configuration

| Propriété  | Type                 | Obligatoire | Exemple                                        | Soutien | Description                                                    |
| ---------- | -------------------- | ----------- | ---------------------------------------------- | ------- | -------------------------------------------------------------- |
| type       | chaîne de caractères | Non         | [stdout, file]                                 | tous    | définir la sortie                                              |
| itinéraire | chaîne de caractères | Non         | verdaccio.log                                  | tous    | si le type est fichier, définissez l’emplacement de ce fichier |
| format     | chaîne de caractères | Non         | [pretty, pretty-timestamped]                   | tous    | format de la sortie                                            |
| niveau     | chaîne de caractères | Non         | [fatal, error, warn, http, info, debug, trace] | tous    | niveau détaillé                                                |