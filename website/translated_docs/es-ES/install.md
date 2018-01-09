---
id: installation
title: Installation
---
Verdaccio is a multiplatform web application, to install you need at least some prerequisites.

#### Prerequisites

1. Node higher than 
    - For version *2.x* we support from **4.6.1**
    - For version *3.x* we support as minimum **6.12.0**
2. npm *>=3.x* or yarn

## Installing the CLI

`Verdaccio` must be install globaly using any of the most modern

Using `npm`

```bash
npm install -g verdaccio
```

or using `yarn`

```bash
yarn global add verdaccio
```

> Warning: Verdaccio current is not support PM2's cluster mode, run it with cluster mode may cause unknown behavior

## Basic Usage

Once has been installed you only need to execute the CLI command.

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:5555/ - verdaccio/3.0.0
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

For more information about CLI please [read the cli section](cli.md).

## Docker Image

`verdaccio` has a official docker image you can use, in the most of cases is good enough just the default configuration, for more information about how to install the official image [read the docker section](docker.md).