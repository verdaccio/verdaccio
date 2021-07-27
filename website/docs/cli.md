---
id: cli
title: "Command Line Tool"
---

The Verdaccio CLI is your tool to start and stop the application.

## Commands {#commands}

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

Command | Default | Example | Description
--- | --- | --- | ---
--listen \ **-l** | 4873 |  -p 7000 | http port
--config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | the configuration file
--info \ **-i** | | | prints local environment information

## Default config file location {#default-config-file-location}

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Config file format {#config-file-format}

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Default storage location {#default-storage-location}

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share.
If you are using a custom storage, this location is irrelevant.

## Default database file location {#default-database-file-location}

The default database file location is in the storage location.
Starting with version 4.0.0, the database file name will be **.verdaccio-db.json** for a new installation of Verdaccio.
When upgrading an existing Verdaccio server, the file name will remain **.sinopia-db.json**.


## Environment variables {#environment-variables}

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)
