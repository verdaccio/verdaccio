---
id: cli
title: "Command Line Tool"
---

Verdaccio је Ваша почетна станица за покретање апликације.

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

Како бисмо лоцирали home directory, ослањамо се на **$XDG_DATA_HOME** као први избор у Windows окружењу где трагамо за [APPDATA environment variablom](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Config file format

Config file should be YAML, JSON or NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Подразумевана локација за чување

Користимо **$XDG_DATA_HOME** environment варијаблу као подразумевано подешавање како бисмо лоцирали подразумевано место за чување које би требало [да буде исто](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) као $HOME/.local/share. Ако користите прилагођено место за чување података (custom storage), онда је локација ирелевантна.

## Подразумевана локација базе података

По правилу, локација фајла базе података је подразумевана локација за чување (storage). Почевши од верзије 4.0.0, име базе података ће бити **.verdaccio-db.json** за нову инсталацију Verdaccio-a. Приликом надоградње постојећег Verdaccio сервера, име фајла ће остати **.sinopia-db.json**.