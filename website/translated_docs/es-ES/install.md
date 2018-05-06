---
id: installation
title: "Installation"
---
Verdaccio es una aplicación web multiplataforma. Para instalarlo, necesitas unos pocos prerrequisitos.

#### Prerrequisitos

1. Node mayor que 
    - En `verdaccio@2.x` Node `v4.6.1` es la versión mínima soportada.
    - For version `verdaccio@beta` Node `6.12.0` is the minimum supported version.
2. npm `>=3.x` o `yarn`
3. La interfaz web soporta los exploradores `Chrome, Firefox, Edge, and IE9`.

## Instalando el CLI

`verdaccio` debe ser instalado globalmente usando uno de los siguientes métodos:

Usando `npm`

```bash
npm install -g verdaccio
```

o usando `yarn`

```bash
yarn global add verdaccio
```

![install verdaccio](/svg/install_verdaccio.svg)

### Beta

⚠️⚠️ **Help us to test the version 3.x in order to release a stable version soon. Remember, to do never test with your original storage folder, do always a backup** ⚠️⚠️

If you are an adventurous developer you can use and install the latest beta version, this is a non stable version, I'd recommend only use for testing purporses.

```bash
$ npm install -g verdaccio@beta
```

## Uso Básico

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/2.7.4
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

For more information about the CLI, please [read the cli section](cli.md).

## Imagen de Docker

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).