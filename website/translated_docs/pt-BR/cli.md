---
id: cli
title: "Utilitário na Linha de Comando"
---

The Verdaccio CLI is your tool to start and stop the application.

## Comandos

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Comando            | Padrão                         | Exemplo        | Descrição                             |
| ------------------ | ------------------------------ | -------------- | ------------------------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | porta http                            |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | o arquivo de configuração             |
| --info \ **-i**   |                                |                | imprime informações do ambiente local |

## Local padrão das Configurações

To locate the home directory, we rely on **$XDG_DATA_HOME** as a first choice and for Windows environments we look for the [APPDATA environment variable](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Formato do arquivo de configuração

Config files should be YAML, JSON or a NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Armazenamento Padrão

We use the **$XDG_DATA_HOME** environment by variable default to locate the storage by default which [should be the same](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) as $HOME/.local/share. Se você estiver usando um tipo de armazenamento diferente do padrão, essa informação é irrelevante.

## Localização padrão da base de dados

O local do arquivo de banco de dados padrão está no local de armazenamento. A partir da versão 4.0.0, o nome do arquivo de banco de dados será **.verdaccio-db.json** para uma nova instalação do Verdaccio. Ao atualizar um servidor Verdaccio existente, o nome do arquivo permanecerá **.sinopia-db.json **.

## Environment variables

[Full list of environment variables](https://github.com/verdaccio/verdaccio/blob/master/docs/env.variables.md).

* `VERDACCIO_HANDLE_KILL_SIGNALS` to enable gracefully shutdown (since v4.12.0)