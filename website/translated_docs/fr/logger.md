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

| Propriété  | Type                 | Obligatoire | Exemple                                        | Soutien | Description                                                    |
| ---------- | -------------------- | ----------- | ---------------------------------------------- | ------- | -------------------------------------------------------------- |
| type       | chaîne de caractères | Non         | [stdout, file]                                 | tous    | définir la sortie                                              |
| itinéraire | chaîne de caractères | Non         | verdaccio.log                                  | tous    | si le type est fichier, définissez l’emplacement de ce fichier |
| format     | chaîne de caractères | Non         | [pretty, pretty-timestamped]                   | tous    | format de la sortie                                            |
| niveau     | chaîne de caractères | Non         | [fatal, error, warn, http, info, debug, trace] | tous    | niveau détaillé                                                |