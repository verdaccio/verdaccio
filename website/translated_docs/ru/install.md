---
id: installation
title: "Установка"
---
Verdaccio — мультиплатформенное веб-приложение. Чтобы его установить, вам потребуется обеспечить некоторые условия.

#### Требования

1. Node выше чем 
    - Для `verdaccio@2.x` Node `v4.6.1` минимальная допустимая версия.
    - Для `verdaccio@latest` Node `6.12.0` минимальная допустимая версия.
2. npm `>=3.x` или `yarn`
3. Обозреватели, поддерживающие веб-интерфейс, `Chrome, Firefox, Edge, and IE9`.

## Installing the CLI

`verdaccio` must be installed globaly using either of the following methods:

Using `npm`

```bash
npm install -g verdaccio
```

or using `yarn`

```bash
yarn global add verdaccio
```

![install verdaccio](/svg/install_verdaccio.gif)

## Basic Usage

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

For more information about the CLI, please [read the cli section](cli.md).

## Docker Image

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).

## Cloudron

`verdaccio` is also available as a 1-click install on [Cloudron](https://cloudron.io)

[![Install](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)