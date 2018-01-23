---
id: installation
title: Installation
---
Verdaccio es una aplicación web multiplataforma, para instalarla al menos necesitas ciertos prerrequisitos.

#### Prerrequisitos

1. Node mayor que 
    - Para la versión de `verdaccio@2.x` soportamos desde Node `v4.6.1`.
    - Para la versión `verdaccio@3.x` soportamos como mínimo Node `6.12.0`
2. npm `>=3.x` o `yarn`
3. La interfaz web soporta los exploradores `Chrome, Firefox, Edge, and IE9`

## Instalando el CLI

`verdaccio` debe ser instalado globamente usando cualquiera de estas opciones

Usando `npm`

```bash
npm install -g verdaccio
```

o usando `yarn`

```bash
yarn global add verdaccio
```

## Uso Básico

Una vez ha sido instalado solo necesitas ejecutar el comando CLI.

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:5555/ - verdaccio/3.0.0
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

Para mas información sobre el CLI por favor [lea la sección cli](cli.md).

## Imagen de Docker

`verdaccio` ofrece una imagen Docker lista para usar, en el mayor de los casos es suficiente con la configuración por defecto, para mas información sobre como instalar la imagen oficial [lea la sección de Docker](docker.md).