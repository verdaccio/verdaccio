<div align="center">
    <a href="https://www.verdaccio.org/">
        <img src="https://github.com/verdaccio/verdaccio/raw/master/assets/bitmap/verdaccio%402x.png">
    </a>
<br>
<br>
<h1>Version 3 Released 🎉</h1>
<h5>
  <a target="_blank" href="https://medium.com/verdaccio/verdaccio-3-released-feb06ef38558">
    All the new features you need to know
  </a>
</h5>
</div>


<div align="center">
  <p>
    A lightweight private npm proxy registry
  </p>
  <a href="https://www.npmjs.org/package/verdaccio"><img alt="npm version" src="https://img.shields.io/npm/v/verdaccio.svg"></a>
  <a href="https://circleci.com/gh/verdaccio/verdaccio"><img alt="CircleCI Status" src="https://circleci.com/gh/verdaccio/verdaccio.svg?style=shield&circle-token=:circle-token"></a>
  <a href="https://codecov.io/github/verdaccio/verdaccio"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/verdaccio/verdaccio/master.svg"></a>
  <a href="https://www.npmjs.org/package/verdaccio"><img alt="npm Downloads" src="http://img.shields.io/npm/dm/verdaccio.svg"></a>
  <a href="https://hub.docker.com/r/verdaccio/verdaccio/"><img alt="npm Downloads" src="https://img.shields.io/docker/pulls/verdaccio/verdaccio.svg?maxAge=43200"></a>
  <a href="https://www.browserstack.com/automate/public-build/am8rVDJ1V1BSbW90aE4xUnZsbnNUOFVuVS9ZRmJWL3NWcjkzRUxycHF3TT0tLUh5aTBiY2VzT1A1NDRWdHg2L0FQT3c9PQ==--0e9064ebcb01bfebb9976a543500b0396c0bfcae%"><img src='https://www.browserstack.com/automate/badge.svg?badge_key=am8rVDJ1V1BSbW90aE4xUnZsbnNUOFVuVS9ZRmJWL3NWcjkzRUxycHF3TT0tLUh5aTBiY2VzT1A1NDRWdHg2L0FQT3c9PQ==--0e9064ebcb01bfebb9976a543500b0396c0bfcae%'/></a>
  <a href="https://discord.gg/AwXRqPD"
  ><img alt="discord" src="https://img.shields.io/badge/Discord-%23questions%20%23general-blue.svg"/>
  </a>
</div>
<div align="center">
  <p align="center"><img src="https://github.com/verdaccio/verdaccio/blob/master/assets/gif/verdaccio_big_30.gif?raw=true"></p>

</div>

<h2 align="center">Install</h2>

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


<h2 align="center">Introduction</h2>

Verdaccio is a simple, **zero-config-required local private npm registry**. No need for an entire database just to get started! Verdaccio comes out of the box with **its own tiny database**, and the ability to proxy other registries (eg. npmjs.org), caching the downloaded modules along the way. For those looking to extend their storage capabilities, Verdaccio **supports various community-made plugins to hook into services such as Amazon's s3 and Google Cloud Storage**.

### Use private packages

   If you want to use all benefits of npm package system in your company without sending all code to the public, and use your private packages just as easy as public ones.

### Cache npmjs.org registry

   If you have more than one server you want to install packages on, you might want to use this to decrease latency
   (presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache) or avoid issues like *[How one developer just broke Node, Babel and thousands of projects in 11 lines of JavaScript](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/)*, *[Many packages suddenly disappeared](https://github.com/npm/registry/issues/255?source=techstories.org)* or *[Registry returns 404 for a package I have installed before](https://github.com/npm/registry/issues/329)*.
   
### Link multiple registries

If you use multiples registries in your organization and need to fetch packages from multiple sources in one single project you might take advance of the uplinks feature with Verdaccio, chaining multiple registries and fetching from one single endpoint.


### Override public packages

   If you want to use a modified version of some 3rd-party package (for example, you found a bug, but maintainer didn't accept pull request yet), you can publish your version locally under the same name.

See in detail each of these [use cases](https://github.com/verdaccio/verdaccio/tree/master/docs/use-cases.md).

<h2 align="center">Get Started</h2>

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

<h2 align="center">Publishing Private Packages</h2>

#### Create an user and log in

```bash
npm adduser --registry http://localhost:4873
```

#### Publish your package

```bash
npm publish --registry http://localhost:4873
```

This will prompt you for user credentials which will be saved on the `verdaccio` server.

<h2 align="center"> Docker</h2>

Below are the most commony needed informations,
every aspect of Docker and verdaccio is [documented separately](https://www.verdaccio.org/docs/en/docker.html)


```
docker pull verdaccio/verdaccio
```

Available as [tags](https://hub.docker.com/r/verdaccio/verdaccio/tags/).

```
docker pull verdaccio/verdaccio:3.0.0
```

### Running verdaccio using Docker

To run the docker container:

```bash
docker run -it --rm --name verdaccio -p 4873:4873 verdaccio/verdaccio
```

Docker examples are available [in this repository](https://github.com/verdaccio/docker-examples).

<h2 align="center">Compatibility</h2>

Verdaccio aims to support all features of a standard npm client that make sense to support in private repository. Unfortunately, it isn't always possible.

### Basic features

- Installing packages (npm install, npm upgrade, etc.) - **supported**
- Publishing packages (npm publish) - **supported**

### Advanced package control

- Unpublishing packages (npm unpublish) - **supported**
- Tagging (npm tag) - **supported**
- Deprecation (npm deprecate) - not supported - *PR-welcome*

### User management

- Registering new users (npm adduser {newuser}) - **supported**
- Transferring ownership (npm owner add {user} {pkg}) - not supported, *PR-welcome*
### Misc stuff

- Searching (npm search) - **supported** (cli / browser)
- Ping (npm ping) - **supported**
- Starring (npm star, npm unstar) - not supported, *PR-welcome*

### Security

- npm audit - **supported**

<h2 align="center">Contributors</h2>

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="../../graphs/contributors"><img src="https://opencollective.com/verdaccio/contributors.svg?width=890&button=false" /></a>


### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/verdaccio#backer)]

<a href="https://opencollective.com/verdaccio#backers" target="_blank"><img src="https://opencollective.com/verdaccio/backers.svg?width=890"></a>


### Sponsors

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

<h2 align="center"> FAQ / Contact / Troubleshoot</h2>

If you have any issue you can try the following options, do no desist to ask or check our issues database, perhaps someone has asked already what you are looking for.

* [Roadmap](https://github.com/verdaccio/verdaccio/wiki)
* [Most common questions](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
* [Reporting a bug](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
* [Running discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
* [Chat Room](https://gitter.im/verdaccio/)
* [Logos](https://github.com/verdaccio/verdaccio/tree/master/assets)


<h2 align="center">License</h2>

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)

The Verdaccio documentation and logos (e.g., .md, .png, .sketch)  files in the /docs and /assets folder) is [Creative Commons licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE-docs).
