## Goals

We want to create a private/caching npm repository server. The idea of it to be as simple as it could possibly be, which means "just download and run it". As I recall, there're no such things available now, is there?

There's two obvious use-cases:

1. Private repository. If you want to use all benefits of npm package system in your company without sending all code to the public, you'll want that.

2. Caching. If you have more than one server you want to install packages on, you might want to use this to decrease latency (presumably "slow" npmjs.org will be connected to only once per package/version) and provide limited failover (if npmjs.org is down, we might still find something useful in the cache).

## Disclaimer

I don't know the internal npm stuff yet, so if npm repository heavily depends on some complex CouchDB functions, this unive^W project is doomed.

## Name of a project

Now it's "npmrepod" for "npm repository daemon". Better name suggestions are very much welcome. :)

By the way, is it called "repository" or "registry" anyway?

## Configuration

It should be able to work without any configuration, just install and run it.

Of course for some advanced usage a configuration file would be necessary. So it'll probably be a javascript or yaml config. We would want to include custom functions there as plugins, so... yeah, it's probably javascript file.

## Using public packages from npm.js / caching

If some package doesn't exist in the storage, server would forward requests to npmjs.org. If npmjs.org is down, we would serve packages from cache pretending that no other packages exist. We would download only what's needed (= requested by clients), and this information would be cached forever.

Example: if you successfully request express@3.0.1 from this server once, you'll able to do that again (with all it's dependencies) anytime even if npmjs.org is down. But say express@3.0.0 will not be downloaded until it's actually needed by somebody. And if npmjs.org is offline, this server would say that only express@3.0.1 (= only what's in the cache) is published, but nothing else.

Open question: can we track package changes on npmjs.org without replicating their entire database?

## Features

For now I'm planning to make `npm publish` and `npm install` work with this repository. Advanced features like `npm search` are so to speak not a priority.

## Access control

It is supposed to be private repository. We can't allow just anybody to see/download any package as it is in npmjs.org. So it's an open question how access control should be implemented.

Maybe configuration would be simular to gitolite with working groups and such.

Should we allow anybody to publish any package by default? Should it be configurable? Shall we use users from npmjs.org or use our own user management? Well... those questions are up.

## Storage

No CouchDB. It is supposed to work with zero configuration, so filesystem would be used for storage by default.

But our company would want to use MongoDB for ourselves, because we have several servers with MongoDB replication set up.

So, we would implement some kind of plugin system. There would be at least two plugins with the package (filesystem as a default, mongodb), but if someone wants to use CouchDB or whatever he could write a plugin himself.

## Plugins

- storage (filesystem, database)
- logging (bunyan interface?)

## Existing things

- npm + git (I mean, using git+ssh:// dependencies) - most people seem to use this, but it's a terrible idea... *npm update* doesn't work, can't use git subdirectories this way, etc.
- shadow-npm (https://github.com/dominictarr/shadow-npm, http://shadow-npm.net/) - it uses the same code as npmjs.org + service is dead
- http://www.gemfury.com/l/npm-registry and others - those are closed-source cloud services, and I'm not in a mood to trust my private code to somebody (security through obscurity yeah!)
- npm-registry-proxy, npm-delegate, npm-proxy - those are just proxies...

Anything else?

