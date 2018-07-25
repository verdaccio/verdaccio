---
id: installation
title: "安装"
---
Verdaccio 是一个多平台网页应用程序。在安装之前，您需要具有一些先决条件。

#### 最低要求:

1. Node.js 版本 
    - 对于`verdaccio@2.x`版本，Node `v4.6.1`是最低支持版本。
    - 对于`verdaccio@latest`版本，Node `6.12.0` 是最低支持版本。
2. npm `>=3.x` or `yarn`
3. 网页界面支持`Chrome, Firefox, Edge, 和 IE9` 浏览器。

## 安装CLI

`verdaccio` 总体上必须用以下两种方法之一来安装：

使用 `npm`

```bash
npm install -g verdaccio
```

或使用 `yarn`

```bash
yarn global add verdaccio
```

![安装verdaccio](/svg/install_verdaccio.gif)

## 基本使用

一旦安装后，您只需要执行CLI 命令：

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.1
```

For more information about the CLI, please [read the cli section](cli.md).

## Docker 镜像

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).