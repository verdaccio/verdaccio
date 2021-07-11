---
id: cli
title: "Инструмент командной строки"
---

The Verdaccio CLI is your tool to start and stop the application.

## Команды

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Команда            | По умолчанию                   | Пример         | Описание                                 |
| ------------------ | ------------------------------ | -------------- | ---------------------------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | http порт                                |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | файл конфигурации                        |
| --info \ **-i**   |                                |                | выводит информацию о локальном окружении |

## Местоположение файла конфигурации по умолчанию

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Формат config-файла

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Местоположение хранилища по умолчанию

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. Но, если вы используете своё место для хранилища, это не имеет значения.

## Местоположение базы данных по умолчанию

По умолчанию, местоположение файла БД совпадает с местоположением хранилища. Начиная с версии 4.0.0, файлу БД будет дано имя **.verdaccio-db.json** для новых установок Verdaccio. При обновлении старых версий, имя файла БД останется старым **.sinopia-db.json**.

## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)