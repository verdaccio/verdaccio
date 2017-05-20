`verdaccio` is a fork of `sinopia`. It aims to keep backwards compatibility with `sinopia`, while keeping up with npm changes.

`verdaccio` - a private/caching npm repository server

[![travis badge](http://img.shields.io/travis/verdaccio/verdaccio.svg)](https://travis-ci.org/verdaccio/verdaccio)
[![npm version badge](https://img.shields.io/npm/v/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![downloads badge](http://img.shields.io/npm/dm/verdaccio.svg)](https://www.npmjs.org/package/verdaccio)
[![Coverage Status](https://coveralls.io/repos/github/verdaccio/verdaccio/badge.svg?branch=master)](https://coveralls.io/github/verdaccio/verdaccio?branch=master)

It allows you to have a local npm registry with zero configuration. You don't have to install and replicate an entire CouchDB database. Verdaccio keeps its own small database and, if a package doesn't exist there, it asks npmjs.org for it keeping only those packages you use.

<p align="center"><img src="https://firebasestorage.googleapis.com/v0/b/jotadeveloper-8d2f3.appspot.com/o/verdaccio2-compressor.png?alt=media&token=c9b01824-26f2-4cba-bd6f-f352e08cb8ff"></p>

## Use cases

1. Use private packages.

   If you want to use all benefits of npm package system in your company without sending all code to the public, and use your private packages just as easy as public ones.

   See [using private packages](#using-private-packages) section for details.

2. Cache npmjs.org registry.

   If you have more than one server you want to install packages on, you might want to use this to decrease latency
   (presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache).

   See [using public packages](#using-public-packages-from-npmjsorg) section for details.

3. Override public packages.

   If you want to use a modified version of some 3rd-party package (for example, you found a bug, but maintainer didn't accept pull request yet), you can publish your version locally under the same name.

   See [override public packages](#override-public-packages) section for details.

## Installation

```bash
# installation and starting (application will create default
# config in config.yaml you can edit later)
$ npm install -g verdaccio
$ verdaccio

# npm configuration
$ npm set registry http://localhost:4873/

# if you use HTTPS, add an appropriate CA information
# ("null" means get CA list from OS)
$ npm set ca null
```

Now you can navigate to [http://localhost:4873/](http://localhost:4873/) where your local packages will be listed and can be searched.

### Docker

To use the latest pre-built [docker image](https://hub.docker.com/r/verdaccio/verdaccio/):

`docker pull verdaccio/verdaccio`

#### By tags

Since version `v2.x` you can pull docker images by [tag](https://hub.docker.com/r/verdaccio/verdaccio/tags/), as follows:

For a major version:

```bash
docker pull verdaccio/verdaccio:2
```
For a minor version:

```bash
docker pull verdaccio/verdaccio:2.1
```

For a specific (minor) version:

```bash
docker pull verdaccio/verdaccio:2.1.7
```

#### Build your own Docker image

```bash
docker build -t verdaccio .
```

There is also an npm script for building the docker image, so you can also do:

```bash
npm run build-docker
```

If you want to use the docker image on a rpi or a compatible device there is also a dockerfile available.
To build the docker image for raspberry pi execute:

```bash
npm run build-docker:rpi
```

To run the docker container:

```
docker run -it --rm --name verdaccio -p 4873:4873 \
  -v /<path to verdaccio directory>/conf:/verdaccio/conf \
  -v /<path to verdaccio directory>/storage:/verdaccio/storage \
  -v /<path to verdaccio directory>/local_storage:/verdaccio/local_storage \
  verdaccio
```

Please note that for any of the above docker commands you need to have docker installed on your machine and the docker executable should be available on your `$PATH`.

### Ansible

A Verdaccio playbook [is available at galaxy](https://galaxy.ansible.com/030/verdaccio) source: https://github.com/030/ansible-verdaccio

### Chef

The Verdaccio Chef cookbook [is available via the chef supermarket](https://supermarket.chef.io/cookbooks/verdaccio). source: https://github.com/kgrubb/verdaccio-cookbook

### Puppet

The original Sinopia puppet module [is available at puppet forge](http://forge.puppetlabs.com/saheba/sinopia) source: https://github.com/saheba/puppet-sinopia

## Configuration

When you start a server, it auto-creates a config file.

#### See also: [server-side configure document](SERVER.md)

## Adding a new user

```bash
npm adduser --registry http://localhost:4873/
```

This will prompt you for user credentials which will be saved on the `verdaccio` server.

## Using private packages

You can add users and manage which users can access which packages.

It is recommended that you define a prefix for your private packages, for example "local", so all your private things will look like this: `local-foo`. This way you can clearly separate public packages from private ones.

## Using public packages from npmjs.org

If some package doesn't exist in the storage, server will try to fetch it from npmjs.org. If npmjs.org is down, it serves packages from cache pretending that no other packages exist. Verdaccio will download only what's needed (= requested by clients), and this information will be cached, so if client will ask the same thing second time, it can be served without asking npmjs.org for it.

Example: if you successfully request express@3.0.1 from this server once, you'll able to do that again (with all it's dependencies) anytime even if npmjs.org is down. But say express@3.0.0 will not be downloaded until it's actually needed by somebody. And if npmjs.org is offline, this server would say that only express@3.0.1 (= only what's in the cache) is published, but nothing else.

## Override public packages

If you want to use a modified version of some public package `foo`, you can just publish it to your local server, so when your type `npm install foo`, it'll consider installing your version.

There's two options here:

1. You want to create a separate fork and stop synchronizing with public version.

   If you want to do that, you should modify your configuration file so verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to *config.yaml* and remove `npmjs` from `proxy` list and restart the server.

   When you publish your package locally, you should probably start with version string higher than existing one, so it won't conflict with existing package in the cache.

2. You want to temporarily use your version, but return to public one as soon as it's updated.

   In order to avoid version conflicts, you should use a custom pre-release suffix of the next patch version. For example, if a public package has version 0.1.2, you can upload 0.1.3-my-temp-fix. This way your package will be used until its original maintainer updates his public package to 0.1.3.

## Compatibility

Verdaccio aims to support all features of a standard npm client that make sense to support in private repository. Unfortunately, it isn't always possible.

Basic features:

- Installing packages (npm install, npm upgrade, etc.) - **supported**
- Publishing packages (npm publish) - **supported**

Advanced package control:

- Unpublishing packages (npm unpublish) - **supported**
- Tagging (npm tag) - **supported**
- Deprecation (npm deprecate) - not supported

User management:

- Registering new users (npm adduser {newuser}) - **supported**
- Transferring ownership (npm owner add {user} {pkg}) - not supported, verdaccio uses its own acl management system

Misc stuff:

- Searching (npm search) - **supported** (cli / browser)
- Starring (npm star, npm unstar) - not supported, doesn't make sense in private registry
- Ping (npm ping) - **supported** 

## Storage

No CouchDB here. This application is supposed to work with zero configuration, so filesystem is used as a storage.

If you want to use a database instead, ask for it, we'll come up with some kind of a plugin system.

About the storage there is a running discussion [here](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Astorage).

## Similar existing things

- npm + git (I mean, using git+ssh:// dependencies) - most people seem to use this, but it's a terrible idea... *npm update* doesn't work, can't use git subdirectories this way, etc.
- [reggie](https://github.com/mbrevoort/node-reggie) - this looks very interesting indeed... I might borrow some code there.
- [shadow-npm](https://github.com/dominictarr/shadow-npm), [public service](http://shadow-npm.net/) - it uses the same code as npmjs.org + service is dead
- [gemfury](http://www.gemfury.com/l/npm-registry) and others - those are closed-source cloud services, and I'm not in a mood to trust my private code to somebody (security through obscurity yeah!)
- npm-registry-proxy, npm-delegate, npm-proxy - those are just proxies...
- [nexus-repository-oss](https://www.sonatype.com/nexus-repository-oss) - Repository manager that handles more then just NPM dependencies
- Is there something else?
- [codebox-npm](https://github.com/craftship/codebox-npm) - Serverless private npm registry using
