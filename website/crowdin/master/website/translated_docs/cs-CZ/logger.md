---
id: logger
title: "Logger"
---

Jako všechny webové aplikace má verdaccio přizpůsobitelný vestavěný logger. Můžete definovat různé typy výstupů.

```yaml
logs:
  # výstup konzole
  - {type: stdout, format: pretty, level: http}
  # výstup souboru
  - {type: file, path: verdaccio.log, level: info}
  # Střídající výstup logu. Možnosti jsou předány přímo do bunyan. Navštivte: https://github.com/trentm/node-bunyan#stream-type-rotating-file
  - {type: rotating-file, format: json, path: /path/to/log.jsonl, level: http, options: {period: 1d}}
```

Použijte `SIGUSR2` pro upozornění aplikace, že se vystřídal soubor logu a je třeba jej znovu otevřít. Poznámka: Střídající se výstup logu není podporován v režimu clusteru. [Navštivte zde](https://github.com/trentm/node-bunyan#stream-type-rotating-file)

### Konfigurace

| Vlastnost | Typ     | Požadované | Příklad                                        | Podpora | Popis                                           |
| --------- | ------- | ---------- | ---------------------------------------------- | ------- | ----------------------------------------------- |
| typ       | řetězec | Ne         | [stdout, file]                                 | všechny | definovat výstup                                |
| cesta     | řetězec | Ne         | verdaccio.log                                  | všechny | pokud je typ soubor, definujte umístění souboru |
| formát    | řetězec | Ne         | [pretty, pretty-timestamped]                   | všechny | výstupní formát                                 |
| úroveň    | řetězec | Ne         | [fatal, error, warn, http, info, debug, trace] | všechny | úroveň podrobností                              |