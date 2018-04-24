---
id: installation
title: "Installation"
---
Verdaccio is a multiplatform web application. To install it, you need a few prerequisites.

#### 最低要求:

1. Node.js 版本 
    - For version `verdaccio@2.x` Node `v4.6.1` is the minimum supported version.
    - For version `verdaccio@beta` Node `6.12.0` is the minimum supported version.
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

### Beta

⚠️⚠️ **Help us to test the version 3.x in order to release a stable version soon. Remember, to do never test with your original storage folder, do always a backup** ⚠️⚠️

If you are an adventurous developer you can use and install the latest beta version, this is a non stable version, I'd recommend only use for testing purporses.

```bash
$ npm install -g verdaccio@beta
```

## 基本使用

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
warn --- config file  - /home/.config/verdaccio/config.yaml
warn --- http address - http://localhost:4873/ - verdaccio/2.7.4
```

![](https://cdn-images-1.medium.com/max/720/1*jDHnZ7_68u5s1lFK2cygnA.gif)

For more information about the CLI, please [read the cli section](cli.md).

## Docker 镜像

`verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).