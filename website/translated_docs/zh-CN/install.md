---
id: installation
title: "安装"
---

Verdaccio 是一个跨平台的 Web 应用程序。 在安装前，你需要满足一些基础的最低要求。

## 最低要求

1. **Node.js** `v12` or higher.

2. 你喜爱的Node包管理器 `npm`、`pnpm` 或 `yarn`（classic 以及 berry）。

> We highly recommend to use the latest versions of Node Package Manager clients `> npm@6.x | yarn@1.x | | yarn@2.x | pnpm@6.x`. Don't support `npm@5.x` or older. Don't support `npm@5.x` or older.

3. A modern web browser to run the web interface. We actually support `Chrome, Firefox, Edge`. We actually support `Chrome, Firefox, Edge`.

> Verdaccio 会根据 [Node. js 发布工作组](https://github.com/nodejs/Release) 的推荐以支持最新的 Node. js 版本。

Are you still using **Verdaccio 4**?. Check the [migration guide](https://verdaccio.org/blog/2021/04/14/verdaccio-5-migration-guide). Check the [migration guide](https://verdaccio.org/blog/2021/04/14/verdaccio-5-migration-guide).

### 快速介绍

Learn the basics before getting started, how to install, where is the location of the configuration file and more. <iframe width="560" height="315" src="https://www.youtube.com/embed/P_hxy7W-IL4?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe>

## 安装命令行界面（CLI）

> 在生产环境中使用Verdaccio前，请先阅读并了解 [最佳实践](best-practices.md)。

`Verdaccio` must be installed globally using either of the following methods:

Using `npm`

```bash
npm install -g verdaccio
```

or using `yarn`

```bash
yarn global add verdaccio
```

or using `pnpm`

```bash
pnpm install -g verdaccio
```

![install verdaccio](assets/install_verdaccio.gif)

## 基本用法

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/5.0.0
```

For more information about the CLI, please [read the cli section](cli.md).

You can set the registry by using the following command.

```bash
npm set registry http://localhost:4873/
```

you can pass a `--registry` flag when needed.

```bash
npm install --registry http://localhost:4873
```

define in your `.npmrc` a `registry` field.

```bash
//.npmrc
registry=http://localhost:4873
```

或在你的 `package.json` 中设置 `publishConfig`

```json
{
  "publishConfig": {
    "registry": "http://localhost:4873"
  }
}
```

## 创建属于你自己的私有NPM包教程

If you'd like a broader explanation, don't miss the tutorial created by [thedevlife](https://mybiolink.co/thedevlife) on how to Create Your Own Private NPM Package using Verdaccio. <iframe width="560" height="315" src="https://www.youtube.com/embed/Co0RwdpEsag?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen mark="crwd-mark"></iframe>

## Docker 镜像

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

`Verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).

## Cloudron

`Verdaccio` is also available as a 1-click install on [Cloudron](https://cloudron.io)

[![安装](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)
