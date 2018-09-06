---
id: cli
title: "Strumento riga di comando"
---
Il CLI di verdaccio è il modo per avviare l'applicazione.

## Comandi

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Comandi            | Impostazione predefinita       | Esempio        | Descrizione               |
| ------------------ | ------------------------------ | -------------- | ------------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | porta http                |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | il file di configurazione |

## Posizione predefinita dei file config

Per individuare la home directory, ci si affida a **$XDG_DATA_HOME** come prima scelta ed in un ambiente Windows si usa [variabile di ambiente APPDATA](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Percorso di archiviazione predefinito

We use **$XDG_DATA_HOME** environment variable as default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. If you are using a custom storage, this location is irrelevant.