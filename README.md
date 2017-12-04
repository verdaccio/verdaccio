# Verdaccio

### A lightweight private npm proxy registry


`verdaccio` is a fork of `sinopia`. It aims to keep backwards compatibility with `sinopia`, while keeping up with npm changes.

### Logo

We have a new logo [thanks for your votes !!!](https://github.com/verdaccio/verdaccio/issues/328) ⚡⚡⚡

[![CircleCI](https://circleci.com/gh/verdaccio/verdaccio/tree/master.svg?style=svg)](https://circleci.com/gh/verdaccio/verdaccio/tree/master)
[![npm version badge](https://img.shields.io/npm/v/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![downloads badge](http://img.shields.io/npm/dm/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![codecov](https://codecov.io/gh/verdaccio/verdaccio/branch/master/graph/badge.svg)](https://codecov.io/gh/verdaccio/verdaccio)
[![Gitter chat](https://badges.gitter.im/verdaccio/questions.png)](https://gitter.im/verdaccio/)

<p align="center"><img src="https://firebasestorage.googleapis.com/v0/b/jotadeveloper-website.appspot.com/o/verdaccio_long_video2.gif?alt=media&token=4d20cad1-f700-4803-be14-4b641c651b41"></p>


It allows you to have a **local npm private registry with zero configuration**. You don't have to install and replicate an entire database. Verdaccio keeps its own small database and, if a package doesn't exist there, **it asks any other registry** (npmjs.org) for it keeping only those packages you use.

## Introduction

### Use private packages

   If you want to use all benefits of npm package system in your company without sending all code to the public, and use your private packages just as easy as public ones.

### Cache npmjs.org registry

   If you have more than one server you want to install packages on, you might want to use this to decrease latency
   (presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache) or avoid issues like *[How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)*.


### Override public packages

   If you want to use a modified version of some 3rd-party package (for example, you found a bug, but maintainer didn't accept pull request yet), you can publish your version locally under the same name.

See in detail each of these [use cases](https://github.com/verdaccio/verdaccio/tree/master/wiki/use-cases.md).

## Get Started

**Help? Don't miss the [documentation section](wiki/README.md)**

### Prerequisites

* Node.js >= `2.x` (4.6.1) | `3.x` (6.12.0)
* `npm` or `yarn`

Installation and starting (application will create default config in config.yaml you can edit later)

```bash
npm install --global verdaccio
```

Run in your terminal

```bash
verdaccio
```

After **npm 5.2** you can use npx which install and launch verdaccio with the same command

```bash
npx verdaccio
```

You would need set some npm configuration, this is optional.

```bash
$ npm set registry http://localhost:4873/
# if you use HTTPS, add an appropriate CA information
# ("null" means get CA list from OS)
$ npm set ca null
```

Now you can navigate to [http://localhost:4873/](http://localhost:4873/) where your local packages will be listed and can be searched.

> Warning: Verdaccio does not currently support PM2's cluster mode, running it with cluster mode may cause unknown behavior.

#### Beta

If you are an adventurous developer you can use and install the latest beta version, this is a non stable version, I'd recommend only use for testing purporses.

```bash
$ npm install -g verdaccio@beta
```

## Publishing Private Packages



#### Create an user and log in

```bash
npm adduser --registry http://localhost:4873
```

#### Publish your package

```bash
npm publish --registry http://localhost:4873
```

This will prompt you for user credentials which will be saved on the `verdaccio` server.

## Server Side Configuration

When you start a server, it auto-creates a config file. For instructions on how to run Verdaccio as a service, with a nice URL or behind a proxy have a look at the [server-side configure document](https://github.com/verdaccio/verdaccio/tree/master/wiki/server.md).

## Docker

[![dockeri.co](http://dockeri.co/image/verdaccio/verdaccio)](https://hub.docker.com/r/verdaccio/verdaccio/)

Below are the most commony needed informations,
every aspect of Docker and verdaccio is [documented separately](https://github.com/verdaccio/verdaccio/tree/master/wiki/docker.md)

### Prebuilt images

To pull the latest pre-built [docker image](https://hub.docker.com/r/verdaccio/verdaccio/):

```bash
docker pull verdaccio/verdaccio
```

Since version 2 images for every version are available as [tags](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

### Running verdaccio using Docker

To run the docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

### Using docker-compose

1. Get the latest version of [docker-compose](https://github.com/docker/compose).
2. Build and run the container:

```bash
$ docker-compose up --build
```
Docker examples are available [in this repository](https://github.com/verdaccio/docker-examples).

* Docker + Nginx
* Docker + Kubernetes
* Docker + Apache

### Advanced Infrastructure Management Tools

#### Ansible

A Verdaccio playbook [is available at galaxy](https://galaxy.ansible.com/030/verdaccio)

Source: [https://github.com/verdaccio/ansible-verdaccio](https://github.com/verdaccio/ansible-verdaccio)

Maintainer: [@030](https://github.com/030)

#### Chef

The Verdaccio Chef cookbook [is available via the chef supermarket](https://supermarket.chef.io/cookbooks/verdaccio).

Source: [https://github.com/verdaccio/verdaccio-cookbook](https://github.com/verdaccio/verdaccio-cookbook).

Maintainer: [@kgrubb](https://github.com/kgrubb)

#### Puppet

Source: [https://github.com/verdaccio/puppet-verdaccio](https://github.com/verdaccio/puppet-verdaccio).

Maintainer: *No asigned yet*



## Compatibility

Verdaccio aims to support all features of a standard npm client that make sense to support in private repository. Unfortunately, it isn't always possible.

### Basic features

- Installing packages (npm install, npm upgrade, etc.) - **supported**
- Publishing packages (npm publish) - **supported**

### Advanced package control

- Unpublishing packages (npm unpublish) - **supported**
- Tagging (npm tag) - **supported**
- Deprecation (npm deprecate) - not supported

### User management

- Registering new users (npm adduser {newuser}) - **supported**
- Transferring ownership (npm owner add {user} {pkg}) - not supported, verdaccio uses its own acl management system

### Misc stuff

- Searching (npm search) - **supported** (cli / browser)
- Starring (npm star, npm unstar) - not supported, doesn't make sense in private registry
- Ping (npm ping) - **supported**

## Storage

No CouchDB here. **This application is supposed to work with zero configuration**, so filesystem is used as a storage.

If you want to use a database instead, ask for it, we'll come up with some kind of a plugin system.

About the storage there is a running discussion [here](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Astorage).

## Similar existing things

- npm + git (I mean, using git+ssh:// dependencies) - most people seem to use this, but it's a terrible idea... *npm update* doesn't work, can't use git subdirectories this way, etc.
- [reggie](https://github.com/mbrevoort/node-reggie) - this looks very interesting indeed... I might borrow some code there.
- [shadow-npm](https://github.com/dominictarr/shadow-npm), [public service](http://shadow-npm.net/) - it uses the same code as npmjs.org + service is dead
- [gemfury](http://www.gemfury.com/l/npm-registry) and others - those are closed-source cloud services, and I'm not in a mood to trust my private code to somebody (security through obscurity yeah!)
- npm-registry-proxy, npm-delegate, npm-proxy - those are just proxies...
- [nexus-repository-oss](https://www.sonatype.com/nexus-repository-oss) - Repository manager that handles more than just NPM dependencies
- Is there something else?
- [codebox-npm](https://github.com/craftship/codebox-npm) - Serverless private npm registry using
- [local-npm](https://github.com/nolanlawson/local-npm) - Local and offline-first npm mirror

## FAQ / Contact / Troubleshoot

If you have any issue you can try the following options, do no desist to ask or check our issues database, perhaps someone has asked already what you are looking for.

* [Documentation](wiki/README.md)
* [Most common questions](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
* [Reporting a bug](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
* [Running discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
* [Chat Room](https://gitter.im/verdaccio/)
