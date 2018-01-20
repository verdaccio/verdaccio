---
id: cli
title: Utilitário na Linha de Comando
---
A linha de comando é por onde você pode controlar toda a sua instalação Verdaccio.

## Comandos

```bash
$ verdaccio --listen 4000 --config ~./config.yaml
```

| Comando            | Padrão                         | Exemplo        | Descrição                 |
| ------------------ | ------------------------------ | -------------- | ------------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | porta http                |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | o arquivo de configuração |

## Default config file location

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and Windows environment we look for [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Default storage location

We use **$XDG_DATA_HOME** environment variable as default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. If you are using a custom storage, this location is irrelevant.