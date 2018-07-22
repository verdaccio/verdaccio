---
id: version-3.3.0-installation
title: Installation
original_id: installation
---

Verdaccio is a multiplatform web application. To install it, you need a few prerequisites.

#### Prerequisites

1. Node higher than
    - For version `verdaccio@2.x` Node `v4.6.1` is the minimum supported version.
    - For version `verdaccio@latest` Node `6.12.0` is the minimum supported version.
2. npm `>=3.x` or `yarn`
3. The web interface supports the `Chrome, Firefox, Edge, and IE9` browsers.

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
