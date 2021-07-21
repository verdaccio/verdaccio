---
id: installation
title: "Installation"
---

Verdaccio is a multiplatform web application. To install it, you need a few basic prerequisites.

## Prerequisites {#prerequisites}

1. **Node.js** `v12` or higher.

2. Your favorite Node Package Manager `npm`, `pnpm` or `yarn` (classic and berry).

> We highly recommend to use the latest versions of Node Package Manager clients `> npm@6.x | yarn@1.x | | yarn@2.x | pnpm@6.x`. Don't support `npm@5.x` or older.

3. A modern web browser to run the web interface. We actually support `Chrome, Firefox, Edge`.

> Verdaccio will support latest Node.js version according the [Node.js Release Working Group](https://github.com/nodejs/Release) recomendations.

Are you still using **Verdaccio 4**?. Check the [migration guide](https://verdaccio.org/blog/2021/04/14/verdaccio-5-migration-guide).

### Quick Introduction {#quick-introduction}

Learn the basics before getting started, how to install, where is the location of the configuration file and more.

<iframe width="560" height="315" src="https://www.youtube.com/embed/P_hxy7W-IL4?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Installing the CLI {#installing-the-cli}

> Before using Verdaccio in production, please read and be [aware of the best practices](best-practices.md).

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

![install verdaccio](/img/install_verdaccio.gif)

## Basic Usage {#basic-usage}

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

```bash title=".npmrc"
registry=http://localhost:4873
```

Or a `publishConfig` in your `package.json`

```json
{
  "publishConfig": {
    "registry": "http://localhost:4873"
  }
}
```

## Create Your Own Private NPM Package Tutorial {#create-your-own-private-npm-package-tutorial}

If you'd like a broader explanation, don't miss the tutorial created by [thedevlife](https://mybiolink.co/thedevlife) on how to Create Your Own Private NPM Package using Verdaccio.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Co0RwdpEsag?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Docker Image {#docker-image}

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

`Verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md).

## Cloudron {#cloudron}

`Verdaccio` is also available as a 1-click install on [Cloudron](https://cloudron.io)

[![Install](https://cloudron.io/img/button.svg)](https://cloudron.io/button.html?app=org.eggertsson.verdaccio)
