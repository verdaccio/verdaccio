<p align="center"><img src="https://github.com/verdaccio/verdaccio/raw/master/assets/bitmap/verdaccio%402x.png"></p>

### A lightweight private npm proxy registry



`verdaccio` is a fork of `sinopia`. It aims to keep backwards compatibility with `sinopia`, while keeping up with npm changes.

[![CircleCI](https://circleci.com/gh/verdaccio/verdaccio/tree/master.svg?style=svg)](https://circleci.com/gh/verdaccio/verdaccio/tree/master)
[![Backers on Open Collective](https://opencollective.com/verdaccio/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/verdaccio/sponsors/badge.svg)](#sponsors) [![npm version badge](https://img.shields.io/npm/v/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![downloads badge](http://img.shields.io/npm/dm/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio.svg)](https://hub.docker.com/r/verdaccio/verdaccio/)
[![Gitter chat](https://badges.gitter.im/verdaccio/questions.png)](https://gitter.im/verdaccio/)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/verdaccio/localized.svg)](https://crowdin.com/project/verdaccio)
[![dependencies Status](https://david-dm.org/verdaccio/verdaccio/status.svg)](https://david-dm.org/verdaccio/verdaccio)
[![Known Vulnerabilities](https://snyk.io/test/github/verdaccio/verdaccio/badge.svg?targetFile=package.json)](https://snyk.io/test/github/verdaccio/verdaccio?targetFile=package.json)
[![codecov](https://codecov.io/gh/verdaccio/verdaccio/branch/master/graph/badge.svg)](https://codecov.io/gh/verdaccio/verdaccio)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio?ref=badge_shield)


<p align="center"><img src="https://firebasestorage.googleapis.com/v0/b/jotadeveloper-website.appspot.com/o/verdaccio_long_video2.gif?alt=media&token=4d20cad1-f700-4803-be14-4b641c651b41"></p>


It allows you to have a **local npm private registry with zero configuration**. You don't have to install and replicate an entire database. Verdaccio keeps its own small database and, if a package doesn't exist there, **it asks any other registry** (npmjs.org) for it keeping only those packages you use.

## Quick Links

*  [Documentation](http://www.verdaccio.org/docs/en/installation.html)
*  [Chat](https://gitter.im/verdaccio/questions)
*  [Wiki](https://github.com/verdaccio/verdaccio/wiki)

## Introduction

### Use private packages

   If you want to use all benefits of npm package system in your company without sending all code to the public, and use your private packages just as easy as public ones.

### Cache npmjs.org registry

   If you have more than one server you want to install packages on, you might want to use this to decrease latency
   (presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache) or avoid issues like *[How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)*.


### Override public packages

   If you want to use a modified version of some 3rd-party package (for example, you found a bug, but maintainer didn't accept pull request yet), you can publish your version locally under the same name.

See in detail each of these [use cases](https://github.com/verdaccio/verdaccio/tree/master/docs/use-cases.md).

## Get Started

Installation and starting (application will create default config in config.yaml you can edit later)

```bash
npm install --global verdaccio
```

Run in your terminal

```bash
verdaccio
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

⚠️⚠️ **Please, help us to test the version 3.x in order to release a stable version soon. Do never test with your original storage folder, do always a backup** ⚠️⚠️

If you are an adventurous developer you can use and install the latest beta version, this is a non stable version, I'd recommend only use for testing purporses.

```bash
$ npm install -g verdaccio@beta
```
or using docker

```bash
$ docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio:beta
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

## Docker

Below are the most commony needed informations,
every aspect of Docker and verdaccio is [documented separately](http://www.verdaccio.org/docs/en/docker.html)

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

### Security

- npm audit - **supported**

## FAQ / Contact / Troubleshoot

If you have any issue you can try the following options, do no desist to ask or check our issues database, perhaps someone has asked already what you are looking for.

* [Roadmap](https://github.com/verdaccio/verdaccio/wiki)
* [Most common questions](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
* [Reporting a bug](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
* [Running discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
* [Chat Room](https://gitter.im/verdaccio/)
* [Logos](https://github.com/verdaccio/verdaccio/tree/master/assets)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="../../graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/verdaccio#backer)]

<a href="https://opencollective.com/verdaccio#backers" target="_blank"><img src="https://opencollective.com/verdaccio/backers.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/verdaccio#sponsor)]

<a href="https://opencollective.com/verdaccio/sponsor/0/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/1/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/2/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/3/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/4/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/5/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/6/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/7/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/8/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/verdaccio/sponsor/9/website" target="_blank"><img src="https://opencollective.com/verdaccio/sponsor/9/avatar.svg"></a>



## License
Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE).

The Verdaccio documentation and logos (e.g., .md, .png, .sketch)  files in the /wiki and /assets folder) is [Creative Commons licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE-docs).



[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio?ref=badge_large)