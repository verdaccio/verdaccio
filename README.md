
Sinopia is a private/caching npm repository server.

It allows you to have a local npm registry with zero configuration. You don't have to install and replicate an entire CouchDB database. Sinopia keeps its own small database and, if a package doesn't exist there, it asks npmjs.org for it keeping only those packages you use.

## Use cases

1. Use private packages. If you want to use all benefits of npm package system in your company without sending all code to the public.

2. Cache npmjs.org registry. If you have more than one server you want to install packages on, you might want to use this to decrease latency (presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache).

3. Override public packages. If you want to use a modified version of some 3rd-party package (for example, you found a bug, but maintainer didn't accepted pull request yet), you can publish your version locally under the same name.

## Installation

```bash
# installation and starting (application will create default
# config in config.yaml you can edit later)
$ npm install -g sinopia
$ sinopia

# npm configuration
$ npm set registry http://localhost:4873/

# if you have any restricted packages, you should add this:
$ npm set always-auth true

# if you use HTTPS, add an appropriate CA information
# ("null" means get CA list from OS)
$ npm set ca null
```


## Configuration

When you start a server, it auto-creates a config file that adds one user (password is printed to stdout only once).

## Using public packages from npm.js / caching

If some package doesn't exist in the storage, server would forward requests to npmjs.org. If npmjs.org is down, we would serve packages from cache pretending that no other packages exist. We would download only what's needed (= requested by clients), and this information would be cached forever.

Example: if you successfully request express@3.0.1 from this server once, you'll able to do that again (with all it's dependencies) anytime even if npmjs.org is down. But say express@3.0.0 will not be downloaded until it's actually needed by somebody. And if npmjs.org is offline, this server would say that only express@3.0.1 (= only what's in the cache) is published, but nothing else.

## Features

For now you can publish packages and read them. Advanced features like `npm search` don't work yet.

## Storage

No CouchDB here. This application is supposed to work with zero configuration, so filesystem is used as a storage.

If you want to use a database instead, ask for it, we'll come up with some kind of a plugin system.

## Simular existing things

- npm + git (I mean, using git+ssh:// dependencies) - most people seem to use this, but it's a terrible idea... *npm update* doesn't work, can't use git subdirectories this way, etc.
- [reggie](https://github.com/mbrevoort/node-reggie) - this looks very interesting indeed... I might borrow some code there.
- [shadow-npm](https://github.com/dominictarr/shadow-npm), [public service](http://shadow-npm.net/) - it uses the same code as npmjs.org + service is dead
- [gemfury](http://www.gemfury.com/l/npm-registry) and others - those are closed-source cloud services, and I'm not in a mood to trust my private code to somebody (security through obscurity yeah!)
- npm-registry-proxy, npm-delegate, npm-proxy - those are just proxies...
- Is there something else?

