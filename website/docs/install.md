---
id: installation
title: 'Installation'
---

Verdaccio is a Node.js private and proxy registry. To install it, you need a few basic prerequisites.

## Prerequisites {#prerequisites}

1. **Node.js** `v16` or higher.

2. Your favorite Node Package Manager `npm`, `pnpm` or `yarn` (classic and modern).

> We highly recommend to use the latest versions of Node Package Manager clients `> npm@6.x | yarn@1.x | | yarn@2.x | pnpm@6.x`. Don't support `npm@5.x` or older.

3. A modern web browser to run the web interface. We actually support `Chrome, Firefox, Edge`.

> Verdaccio will support latest Node.js version according the [Node.js Release Working Group](https://github.com/nodejs/Release) recomendations.

### Quick Introduction {#quick-introduction}

Learn the basics before getting started, how to install, where is the location of the configuration file and more.

<iframe width="560" height="515" src="https://www.youtube.com/embed/hDIFKzmoCaA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Installing the CLI {#installing-the-cli}

> Before using Verdaccio in production, please read and be [aware of the best practices](best-practices.md).

`Verdaccio` must be installed globally using either of the following methods:

Using `npm`

```bash
npm install -g verdaccio@next-7
```

or using `yarn@1.x` _classic_,

```bash
yarn global add verdaccio@next-7
```

or using `pnpm`

```bash
pnpm install -g verdaccio@next-7
```

![install verdaccio](/img/install_verdaccio.gif)

## Basic Usage {#basic-usage}

Once it has been installed, you only need to execute the CLI command:

```bash
$> verdaccio
 info -=- local storage path /Users/user/.local/share/verdaccio/storage/.verdaccio-db.json
 info --- using htpasswd file: /Users/user/.config/verdaccio/htpasswd
 info --- http address http://localhost:4873/
 info --- version: 6.0.0-6-next.48
 info --- server started
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

For alternative configurations, please read the [Using a private registry](cli-registry.md) section.

## Create Your Own Private NPM Package Tutorial {#create-your-own-private-npm-package-tutorial}

If you'd like a broader explanation, don't miss the tutorial created by [thedevlife](https://mybiolink.co/thedevlife) on how to Create Your Own Private NPM Package using Verdaccio.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Co0RwdpEsag?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Docker Image {#docker-image}

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio:nightly-master
```

`Verdaccio` has an official docker image you can use, and in most cases, the default configuration is good enough. For more information about how to install the official image, [read the docker section](docker.md), furthermore you can learn more about combining Docker images in our [docker-examples](https://github.com/verdaccio/verdaccio/tree/master/docker-examples) repository.

## Helm Chart {#helm-chart}

```bash
$ helm repo add verdaccio https://charts.verdaccio.org
$ helm repo update
$ helm install registry --set image.tag=nightly-master verdaccio/verdaccio
```
