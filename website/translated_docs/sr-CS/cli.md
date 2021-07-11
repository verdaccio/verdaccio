---
id: cli
title: "Command Line Tool"
---

The Verdaccio CLI is your tool to start and stop the application.

## Komande

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Komanda            | Podrazumevano                  | Primer         | Opis                                 |
| ------------------ | ------------------------------ | -------------- | ------------------------------------ |
| --listen \ **-l** | 4873                           | -p 7000        | http port                            |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | file za konfigurisanje               |
| --info \ **-i**   |                                |                | prints local environment information |

## Podrazumevana lokacija config file-a

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Config file format

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Podrazumevana lokacija za čuvanje

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. Ako koristite prilagođeno mesto za čuvanje podataka (custom storage), onda je lokacija irelevantna.

## Podrazumevana lokacija baze podataka

Po pravilu, lokacija fajla baze podataka je podrazumevana lokacija za čuvanje (storage). Počevši od verzije 4.0.0, ime baze podataka će biti **.verdaccio-db.json** za novu instalaciju Verdaccio-a. Prilikom nadogradnje postojećeg Verdaccio servera, ime fajla će ostati **.sinopia-db.json**.

## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)