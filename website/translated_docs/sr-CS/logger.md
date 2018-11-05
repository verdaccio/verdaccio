---
id: logger
title: "Logger"
---
Kao i svaka web aplikacija, verdaccio poseduje ugrađeni logger koji se može prilagođavati po želji korisnika. Možete definisati različite tipove izlaza.

```yaml
logs:
  # console output
  - {type: stdout, format: pretty, level: http}
  # file output
  - {type: file, path: verdaccio.log, level: info}
  # Rotating log stream. Opcije se prosleđuju direktno do bunyan. See: https://github.com/trentm/node-bunyan#stream-type-rotating-file
  - {type: rotating-file, format: json, path: /path/to/log.jsonl, level: http, options: {period: 1d}}
```

Koristite `SIGUSR2` da obavestite aplikaciju, log-file je rotiran (rotated) i onda je potrebno da se ponovo otvori. Napomena: Rotating log stream nije podržan u klaster modu. [Pročitajte ovde](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

### Konfigurisanje

| Svojstvo | Tip    | Neophodno | Primer                                         | Podrška | Opis                                       |
| -------- | ------ | --------- | ---------------------------------------------- | ------- | ------------------------------------------ |
| type     | string | Ne        | [stdout, file]                                 | all     | definiše izlaz                             |
| path     | string | Ne        | verdaccio.log                                  | all     | ako je tip "fajl", definiše lokaciju fajla |
| format   | string | Ne        | [pretty, pretty-timestamped]                   | all     | izlazni format                             |
| level    | string | Ne        | [fatal, error, warn, http, info, debug, trace] | all     | verbose level                              |