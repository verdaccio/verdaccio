---
id: cli
title: "Herramienta de Linea de Comando"
---
El CLI de verdaccio es la forma de iniciar la aplicación.

## Comandos

```bash
verdaccio --listen 4000 --config ~./config.yaml
```

| Comando            | Por Defecto                    | Ejemplo        | Descripción                 |
| ------------------ | ------------------------------ | -------------- | --------------------------- |
| --listen \ **-l** | 4873                           | -p 7000        | puerto http                 |
| --config \ **-c** | ~/.local/verdaccio/config.yaml | ~./config.yaml | el archivo de configuración |

## Ubicación por defecto del archivo de configuración

Para localizar el directorio de inicio, verdaccio confia en **$XDG_DATA_HOME** como primera opción y en un ambiente Windows se usa [la variable de ambiente APPDATA](https://www.howtogeek.com/318177/what-is-the-appdata-folder-in-windows/).

## Ubicación del almacenamiento

Verdaccio usa la variable de ambiente **$XDG_DATA_HOME** por defecto para ubicar el almacenamiento por defecto, el cual [debería ser lo mismo ](https://askubuntu.com/questions/538526/is-home-local-share-the-default-value-for-xdg-data-home-in-ubuntu-14-04) que $HOME/.local/share. Si estas usando un almacenamiento personalizado, lo anterior es irrelevante.