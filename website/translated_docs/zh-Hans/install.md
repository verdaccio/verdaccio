---
id: installation
title: Installation
---
Verdaccio 是一个基于 Web 技术的跨平台应用，在安装它之前你需要确保满足以下前提条件

#### 最低要求:

1. Node.js 版本 
    - For version `verdaccio@2.x` we support from Node `v4.6.1`.
    - For version `verdaccio@3.x` we support as minimum Node `6.12.0`
2. npm `>=3.x` or `yarn`
3. The web interface support browsers `Chrome, Firefox, Edge, and IE9`

## 安装

`verdaccio` must be install globaly using any of the most modern

使用 `npm`

```bash
npm install -g verdaccio
```

或使用 `yarn`

```bash
yarn global add verdaccio
```

## 基本使用

安装后只需要通过命令行启动即可使用

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:5555/ - verdaccio/3.0.0
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

阅读 [命令行文档](cli.md) 以了解更多信息。

## Docker 镜像

`Verdaccio` 提供了官方 Docker 镜像可供使用, 默认配置可以满足大多数用户的使用需求，如果希望了解更多有关于如何安装和使用 Docker 镜像的信息，请 [阅读文档中的 Docker 部分](docker.md).