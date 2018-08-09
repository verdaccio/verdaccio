---
id: installation
title: "Instalacja"
---
Verdaccio jest wieloplatformową aplikacją internetową. Aby ją zainstalować, musisz spełnić kilka wymagań.

#### Wymagania

1. Node higher than 
    - For version `verdaccio@2.x` Node `v4.6.1` is the minimum supported version.
    - For version `verdaccio@latest` Node `6.12.0` is the minimum supported version.
2. npm `>=3.x` or `yarn`
3. Interfejs sieci web obsługujący przeglądarki `Chrome, Firefox, Edge i IE9`.

## Instalacja CLI

`verdaccio` musi być zainstalowany globalnie używając dowolnej z poniższych metod:

Za pomocą `npm`

```bash
npm install -g verdaccio
```

lub za pomocą `yarn`

```bash
yarn global add verdaccio
```

![install verdaccio](/svg/install_verdaccio.gif)

## Basic Usage

Po jego zainstalowaniu, trzeba tylko wywołać komendę CLI:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

Aby uzyskać więcej informacji o CLI, zapoznaj się z [sekcją cli](cli.md).

## Docker Image

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).