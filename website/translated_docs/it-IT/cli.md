---
id: cli
title: "Strumento riga di comando"
---

The Verdaccio CLI is your tool to start and stop the application.

## Comandi

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Comandi            | Impostazione predefinita       | Esempio        | Descrizione                          |
| ------------------ | ------------------------------ | -------------- | ------------------------------------ |
| --listen \ **-l** | 4873                           | -p 7000        | porta http                           |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | il file di configurazione            |
| --info \ **-i**   |                                |                | prints local environment information |

## Posizione predefinita dei file config

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Formato del file di configurazione

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Percorso di archiviazione predefinito

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. Se si utilizza un'archiviazione dati personalizzata, questo percorso è irrilevante.

## Percorso predefinito del file database

Il percorso predefinito del file di database è il percorso dell'archiviazione. A partire dalla versione 4.0.0, il nome del file di database per una nuova installazione di Verdaccio sarà **.verdaccio-db.json**. Quando si esegue l'upgrade di un server Verdaccio esistente, il nome del file rimarrà **.sinopia-db.json**.

## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)