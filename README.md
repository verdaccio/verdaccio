# Verdaccio
> A lightweight private npm proxy registry.

[![npm Version](https://img.shields.io/npm/v/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![CircleCI Status](https://circleci.com/gh/verdaccio/verdaccio.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/verdaccio/verdaccio)
[![Coverage Status](https://img.shields.io/codecov/c/github/verdaccio/verdaccio/master.svg)](https://codecov.io/github/verdaccio/verdaccio)
[![npm Downloads](http://img.shields.io/npm/dm/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio.svg?maxAge=43200)](https://hub.docker.com/r/verdaccio/verdaccio/)
[![Discord #questions #general](https://img.shields.io/badge/Discord-%23questions%20%23general-blue.svg)](https://discord.gg/AwXRqPD)

**Version 3 released 🎉!
[Click here to learn about the new features](https://medium.com/verdaccio/verdaccio-3-released-feb06ef38558).**

<div align="center">
  <p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true">
  </p>
</div>

## Contents

- [Contents](#contents)
- [Introduction](#introduction)
  - [Private Packages](#private-packages)
  - [Registry Caching](#registry-caching)
  - [Link Multiple Registries](#link-multiple-registries)
  - [Override Public Packages](#override-public-packages)
- [Installing](#installing)
- [Running](#running)
- [Publishing Private Packages](#publishing-private-packages)
  - [Create User and Login](#create-user-and-login)
  - [Publish Package](#publish-package)
- [Docker](#docker)
  - [Running Verdaccio on Docker](#running-verdaccio-on-docker)
- [NPM Compatibility](#npm-compatibility)
  - [Basic Features](#basic-features)
  - [Advanced Package Control](#advanced-package-control)
  - [User Management](#user-management)
  - [Miscellaneous](#miscellaneous)
  - [Security](#security)
- [Contributors](#contributors)
  - [Backers](#backers)
  - [Sponsors](#sponsors)
- [FAQ/Contact/Troubleshooting](#faqcontacttroubleshooting)
- [License](#license)

## Introduction

Verdaccio is a simple, **zero-config-required local private npm registry**.
No need for an entire database just to get started! Verdaccio comes out of the
box with **its own tiny database**, and the ability to proxy other registries
(eg. npmjs.org), caching the downloaded modules along the way.

For those looking to extend their storage capabilities, Verdaccio **supports
various community-made plugins to hook into services such as Amazon S3 and
Google Cloud Storage**.

### Private Packages

If you want to use all benefits of npm package system in your company without
sending all code to the public, and use your private packages just as easy as
public ones.

### Registry Caching

If you have more than one server you want to install packages on, you might want
to use this to decrease latency (presumably "slow" npmjs.org will be connected
to only once per package/version) and provide limited failover (if npmjs.org is
down, we might still find something useful in the cache) or avoid issues like *[How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)*, *[Many packages suddenly disappeared](https://github.com/npm/registry-issue-archive/issues/255)* or *[Registry returns 404 for a package I have installed before](https://github.com/npm/registry-issue-archive/issues/329)*.

### Link Multiple Registries

If you use multiples registries in your organization and need to fetch packages
from multiple sources in one single project you might take advance of the
uplinks feature with Verdaccio, chaining multiple registries and fetching from
one single endpoint.

### Override Public Packages

If you want to use a modified version of some 3rd-party package (for example,
you found a bug, but maintainer didn't accept pull request yet), you can
publish your version locally under the same name.

See in detail each of these
[use cases](https://github.com/verdaccio/verdaccio/tree/master/docs/use-cases.md).

## Installing

Install with npm:

```bash
npm install --global verdaccio
```

Install with yarn:

```bash
yarn global add verdaccio
```

Install with pnpm:

```bash
pnpm i -g verdaccio
```

## Running

Run the server:

```bash
$ verdaccio
```

You would need set some npm configuration, this is optional.

```bash
$ npm set registry http://localhost:4873/
# if you use HTTPS, add an appropriate CA information
# ("null" means get CA list from OS)
$ npm set ca null
```

Now you can navigate to [http://localhost:4873/](http://localhost:4873/)
where your local packages will be listed and can be searched.

**WARNING**: Verdaccio does not currently support PM2's cluster mode.
Running it with cluster mode may cause unknown behavior.

## Publishing Private Packages

### Create User and Login

```bash
$ npm adduser --registry http://localhost:4873
```

For scoped packages, you can log in for a specific scope:

```bash
$ npm adduser --registry http://localhost:4873 --scope=@mycompany
```

### Publish Package

```bash
$ npm publish --registry http://localhost:4873
```

This will prompt you for user credentials which will be saved on the `verdaccio` server.

If you are publishing a scoped package, the registry argument is optional

## Docker

Below are the most commonly needed informations,
every aspect of Docker and verdaccio is [documented separately](https://www.verdaccio.org/docs/en/docker.html)


```bash
$ docker pull verdaccio/verdaccio
```

Available as [tags](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

```bash
$ docker pull verdaccio/verdaccio:3.0.0
```

### Running Verdaccio on Docker

To run the docker container:

```bash
$ docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Docker examples are available [in this repository](https://github.com/verdaccio/docker-examples).

## NPM Compatibility

Verdaccio aims to support all features of a standard npm client that make sense
to support in private repository. Unfortunately, it isn't always possible.

### Basic Features

- Installing packages (npm install, npm upgrade, etc.) - **supported**
- Publishing packages (npm publish) - **supported**

### Advanced Package Control

- Unpublishing packages (npm unpublish) - **supported**
- Tagging (npm tag) - **supported**
- Deprecation (npm deprecate) - not supported - *PR-welcome*

### User Management

- Registering new users (npm adduser {newuser}) - **supported**
- Transferring ownership (npm owner add {user} {pkg}) - not supported, *PR-welcome*

### Miscellaneous

- Searching (npm search) - **supported** (cli / browser)
- Ping (npm ping) - **supported**
- Starring (npm star, npm unstar) - not supported, *PR-welcome*

### Security

- npm audit - **supported**

## Contributors

This project exists thanks to all the people who contribute.

[Click here to become a contributor](./CONTRIBUTING.MD).

<a href="../../graphs/contributors">
  <img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false">
</a>

### Backers

Thank you to all our backers! 🙏

[Click here to become a backer](https://opencollective.com/verdaccio#backer).

<a href="https://opencollective.com/verdaccio#backers" target="_blank">
  <img src="https://opencollective.com/verdaccio/backers.svg?width=890">
</a>

### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a
link to your website. 

[Click here to become a sponsor](https://opencollective.com/verdaccio#sponsor).

<a href="https://opencollective.com/verdaccio/sponsor/0/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/0/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/1/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/1/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/2/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/2/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/3/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/3/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/4/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/4/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/5/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/5/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/6/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/6/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/7/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/7/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/8/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/8/avatar.svg">
</a>
<a href="https://opencollective.com/verdaccio/sponsor/9/website" target="_blank">
  <img src="https://opencollective.com/verdaccio/sponsor/9/avatar.svg">
</a>

## FAQ/Contact/Troubleshooting

If you have any issues, there are options.

Do not resist to ask questions or check our issues. Perhaps someone has already
asked the same question as you.

Helpful links:

* [Roadmap](https://github.com/verdaccio/verdaccio/wiki)
* [Most common questions](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
* [Reporting a bug](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
* [Running discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
* [Chat Room](http://chat.verdaccio.org/)
* [Logos](https://github.com/verdaccio/verdaccio/tree/master/assets)

## License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE).

The Verdaccio documentation and logos (e.g., .md, .png, .sketch) in the `/docs`
 and `/assets` folders) is [Creative Commons licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE-docs).
