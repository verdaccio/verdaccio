---
id: installation
title: "Instalação"
---
Verdaccio is a multiplatform web application. To install it, you need a few prerequisites.

#### Pré-requisitos

1. Node, acima da versão 
    - For version `verdaccio@2.x` Node `v4.6.1` is the minimum supported version.
    - For version `verdaccio@3.x` Node `6.12.0` is the minimum supported version.
2. npm `>=3.x` or `yarn`
3. The web interface supports the `Chrome, Firefox, Edge, and IE9` browsers.

## Instação

`verdaccio` must be installed globaly using either of the following methods:

Usando `npm`

```bash
npm install -g verdaccio
```

ou usando `yarn`

```bash
yarn global add verdaccio
```

## Como Usar

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:5555/ - verdaccio/3.0.0
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

For more information about the CLI, please [read the cli section](cli.md).

## Imagem do Docker

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).