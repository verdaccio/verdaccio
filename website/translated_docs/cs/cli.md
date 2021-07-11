---
id: cli
title: "Nástroj příkazové řádky"
---

The Verdaccio CLI is your tool to start and stop the application.

## Příkazy

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Příkaz             | Výchozí hodnota                | Příklad        | Popis                                |
| ------------------ | ------------------------------ | -------------- | ------------------------------------ |
| --listen \ **-l** | 4873                           | -p 7000        | http port                            |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | konfigurační soubor                  |
| --info \ **-i**   |                                |                | vypíše informace o místním prostředí |

## Výchozí umístění konfiguračního souboru

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Formát konfiguračního souboru

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Výchozí místo úložiště

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. Pokud používáte vlastní úložiště, toto umístění je irelevantní.

## Výchozí umístění databázového souboru

Výchozí umístění databázového souboru v úložišti. Počínaje verzí 4.0.0, pro nové instalace Verdaccia bude název souboru databáze **.verdaccio-db.json**. Při aktualizaci existujícího serveru Verdaccia zůstane název souboru **.sinopia-db.json**.

## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)