---
id: cli
title: "Narzędzie wiersza poleceń"
---
The verdaccio CLI is your go start the application.

## Komendy

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Command            | Default                        | Example        | Opis                   |
| ------------------ | ------------------------------ | -------------- | ---------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | http port              |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | the configuration file |

## Domyślna lokalizacja pliku konfiguracyjnego

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and Windows environment we look for [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Domyślna lokalizacja magazynu danych

Domyślnie używamy zmiennej środowiskowej **$XDG_DATA_HOME**, aby zlokalizować domyślny magazyn danych, który [powinien znajdować się](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) w $HOME/.local/share. Jeśli używasz niestandardowego magazynu danych, ta lokalizacja nie ma znaczenia.