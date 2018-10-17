---
id: enregistreur
title: "Enregistreur"
---
Comme toute application Web, verdaccio dispose d'un enregistreur intégré personnalisable. Vous pouvez définir différents types de sorties.

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
  # Rotating log stream. Les options sont transmises directement à Bunyan. Voir: https://github.com/trentm/node-bunyan#stream-type-rotating-file
  - {type: rotating-file, format: json, path: /path/to/log.jsonl, level: http, options: {period: 1d}}
```

En utilisant `SIGUSR2` pour notifier l'application, le fichier journal a été pivoté et doit être rouvert. Remarque: L'activité de rotation des journaux n'est pas prise en charge en mode cluster. [Voir ici](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

### Configuration

| Propriété | Type   | Required | Example                                        | Support | Description                                       |
| --------- | ------ | -------- | ---------------------------------------------- | ------- | ------------------------------------------------- |
| type      | string | No       | [stdout, file]                                 | all     | define the output                                 |
| path      | string | No       | verdaccio.log                                  | all     | if type is file, define the location of that file |
| format    | string | No       | [pretty, pretty-timestamped]                   | all     | output format                                     |
| level     | string | No       | [fatal, error, warn, http, info, debug, trace] | all     | verbose level                                     |