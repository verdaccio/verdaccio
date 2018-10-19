---
id: cli
title: "Command Line Tool"
---
Verdaccio CLI je Vaša pošetna stanica za pokretanje aplikacije.

## Komande

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Komanda            | Podrazumevano                  | Primer         | Opis                   |
| ------------------ | ------------------------------ | -------------- | ---------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | http port              |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | file za konfigurisanje |

## Podrazumevana lokacija config file-a

Kako bismo locirali home directory, oslanjamo se na **$XDG_DATA_HOME** kao prvi izbor u Windows okruženju gde tragamo za [APPDATA environment variablom](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Podrazumevana lokacija za čuvanje

Koristimo **$XDG_DATA_HOME** environment variablu kao podrazumevano podešavanje kako bismo locirali podrazumevano mesto za čuvanje koje bi trebalo [da bude isto](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) kao $HOME/.local/share. Ako koristite prilagođeno mesto za čuvanje podataka (custom storage,) onda je lokacija irelevantna.