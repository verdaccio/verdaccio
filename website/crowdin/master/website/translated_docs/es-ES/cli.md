---
id: cli
title: "Herramienta de Linea de Comando"
---

El CLI de verdaccio es la forma de iniciar la aplicación.

## Comandos

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Comando            | Por Defecto                    | Ejemplo        | Descripción                          |
| ------------------ | ------------------------------ | -------------- | ------------------------------------ |
| --listen \ **-l** | 4873                           | -p 7000        | puerto http                          |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | el archivo de configuración          |
| --info \ **-i**   |                                |                | prints local environment information |

## Ubicación por defecto del archivo de configuración

Para localizar el directorio de inicio, verdaccio confia en **$XDG_DATA_HOME** como primera opción y en un ambiente Windows se usa [la variable de ambiente APPDATA](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Config file format

Config file should be YAML, JSON or NodeJS module. YAML format is detected by parsing config file extension (yaml or yml, case insensitive).

## Ubicación del almacenamiento

Verdaccio usa la variable de ambiente **$XDG_DATA_HOME** por defecto para ubicar el almacenamiento por defecto, el cual [debería ser lo mismo ](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) que $HOME/.local/share. Si estas usando un almacenamiento personalizado, lo anterior es irrelevante.

## Default database file location

The default database file location is in the storage location. Starting with version 4.0.0, the database file name will be **.verdaccio-db.json** for a new installation of Verdaccio. When upgrading an existing Verdaccio server, the file name will remain **.sinopia-db.json**.