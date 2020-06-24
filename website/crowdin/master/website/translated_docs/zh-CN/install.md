---
id: installation
title: "安装"
---

Verdaccio 是一个跨平台的 Web 应用程序。在安装之前，您需要确保系统环境已满足以下条件。

#### 最低要求:

1. Node.js 版本 
    - 对于 `verdaccio@3.x` 版本，Node `v6.12.` 是最低支持版本。
    - 对于 `verdaccio@4.0.0-alpha.x` 或 `verdaccio@4.x`版本， Node `8.x` (LTS "Carbon") 是最低支持版本。
2. npm `>=4.x` 或 `yarn` > 我们强烈建议使用最新的 Node 包管理客户端 `> npm@5.x | yarn@1.x | pnpm@2.x`
3. Web 界面支持 `Chrome, Firefox, Edge, 和 IE11` 浏览器。

> Verdaccio 将根据 [Node. js 发布工作组](https://github.com/nodejs/Release) 的推荐支持最新的 Node. js 版本。

<div id="codefund">''</div>

## 安装CLI

`verdaccio` 需要使用以下两种方法之一安装到全局环境：

使用 `npm`

```bash
npm install -g verdaccio
```

或使用 `yarn`

```bash
yarn global add verdaccio
```

![安装verdaccio](assets/install_verdaccio.gif)

## 基本使用

一旦安装后，您只需要执行命令：

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/3.0.0
```

更多关于CLI的详细信息，请[阅读cli章节](cli.md)。

你可以通过以下命令来设置npm从哪个源下载

```bash
npm set registry http://localhost:4873/
```

你也可以在下载的时候带上参数 `--registry`

```bash
npm install --registry http://localhost:4873
```

## Docker 镜像

`verdaccio` 有官方 docker 镜像可以使用，在大多数情况下，默认配置已经足够了。 更多关于如何安装官方镜像的详细信息，请[阅读docker章节](docker.md)。

## Cloudron

`verdaccio` 可以使用 [Cloudron](https://cloudron.io) 一键安装

[![安装](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)