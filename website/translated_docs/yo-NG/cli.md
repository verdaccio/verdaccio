---
id: cli
title: "Irinṣẹ Ila aṣẹ"
---

The Verdaccio CLI is your tool to start and stop the application.

## Awọn aṣẹ

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Aṣẹ                | Atilẹwa                        | Apẹẹrẹ         | Apejuwe                        |
| ------------------ | ------------------------------ | -------------- | ------------------------------ |
| --listen \ **-l** | 4873                           | -p 7000        | ibudo http                     |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | faili iṣeto naa                |
| --info \ **-i**   |                                |                | n ṣe atẹjade alaye ayika ibilẹ |

## Aaye faili iṣeto atilẹwa

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Ọna faili iṣeto

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Aaye ibi ipamọ atilẹwa

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. Ti o ba n lo ibi ipamọ akanṣe kan, aaye yii ko ṣe pataki.

## Aaye faili ibi ipamọ data atilẹwa

Aaye faili ibi ipamọ data atilẹwa wa ninu aaye ibi ipamọ. Starting with version 4.0.0, the database file name will be **.verdaccio-db.json** for a new installation of Verdaccio. When upgrading an existing Verdaccio server, the file name will remain **.sinopia-db.json**.


## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)
