---
id: cli
title: "Command Line Tool"
---

The Verdaccio CLI is your tool to start and stop the application.

## Команде

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Команда            | Подразумевано                  | Пример         | Опис                                 |
| ------------------ | ------------------------------ | -------------- | ------------------------------------ |
| --listen \ **-l** | 4873                           | -p 7000        | http порт                            |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | фајл за конфигурисање                |
| --info \ **-i**   |                                |                | prints local environment information |

## Подразумевана локација config file-a

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Config file format

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Подразумевана локација за чување

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. Ако користите прилагођено место за чување података (custom storage), онда је локација ирелевантна.

## Подразумевана локација базе података

По правилу, локација фајла базе података је подразумевана локација за чување (storage). Почевши од верзије 4.0.0, име базе података ће бити **.verdaccio-db.json** за нову инсталацију Verdaccio-a. Приликом надоградње постојећег Verdaccio сервера, име фајла ће остати **.sinopia-db.json**.

## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)