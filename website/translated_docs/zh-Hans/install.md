---
id: installation
title: "安装"
---
Verdaccio 是一个多平台网页应用程序。在安装之前，您需要具有一些先决条件。

#### 最低要求:

1. Node.js 版本 
    - For version `verdaccio@2.x` Node `v4.6.1` is the minimum supported version.
    - For version `verdaccio@latest` Node `6.12.0` is the minimum supported version.
2. npm `>=3.x` or `yarn`
3. The web interface supports the `Chrome, Firefox, Edge, and IE9` browsers.

## 安装

`verdaccio` must be installed globaly using either of the following methods:

使用 `npm`

```bash
npm install -g verdaccio
```

或使用 `yarn`

```bash
yarn global add verdaccio
```

![install verdaccio](/svg/install_verdaccio.gif)

## 基本使用

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

For more information about the CLI, please [read the cli section](cli.md).

## Docker 镜像

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).