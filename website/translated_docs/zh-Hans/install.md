---
id: installation
date: 2017-07-10T23:36:56.503Z
title: Installation
---
Verdaccio 是一个基于 Web 技术的跨平台应用，在安装它之前你需要确保满足以下前提条件

#### 最低要求:

1. Node.js 版本 
    - Verdaccio *2.x*: 不低于 **4.6.1**
    - Verdaccio *3.x* 不低于 **6.12.0**
2. npm *>=3.x* 或 yarn

## 安装

`Verdaccio` 必须通过以下任一方式作为全局模块安装

使用 `npm`

```bash
npm install -g verdaccio
```

或使用 `yarn`

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