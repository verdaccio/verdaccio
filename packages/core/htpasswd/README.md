[![verdaccio (latest)](https://img.shields.io/npm/v/verdaccio-htpasswd/latest.svg)](https://www.npmjs.com/package/verdaccio-htpasswd)
[![Known Vulnerabilities](https://snyk.io/test/github/verdaccio/verdaccio-htpasswd/badge.svg?targetFile=package.json)](https://snyk.io/test/github/verdaccio/verdaccio-htpasswd?targetFile=package.json)
[![CircleCI](https://circleci.com/gh/verdaccio/verdaccio-htpasswd.svg?style=svg)](https://circleci.com/gh/ayusharma/verdaccio-htpasswd) [![codecov](https://codecov.io/gh/ayusharma/verdaccio-htpasswd/branch/master/graph/badge.svg)](https://codecov.io/gh/ayusharma/verdaccio-htpasswd)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-htpasswd.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-htpasswd?ref=badge_shield)
[![backers](https://opencollective.com/verdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/verdaccio)
[![discord](https://img.shields.io/discord/388674437219745793.svg)](http://chat.verdaccio.org/)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
[![node](https://img.shields.io/node/v/verdaccio-htpasswd/latest.svg)](https://www.npmjs.com/package/verdaccio-htpasswd)

# Verdaccio Module For User Auth Via Htpasswd

`verdaccio-htpasswd` is a default authentication plugin for the [Verdaccio](https://github.com/verdaccio/verdaccio).

> This plugin is being used as dependency after `v3.0.0-beta.x`. The `v2.x` still contains this plugin built-in.

## Install

As simple as running:

    $ npm install -g verdaccio-htpasswd

## Configure

    auth:
        htpasswd:
            file: ./htpasswd
            # Maximum amount of users allowed to register, defaults to "+infinity".
            # You can set this to -1 to disable registration.
            #max_users: 1000

## Logging In

To log in using NPM, run:

```
    npm adduser --registry  https://your.registry.local
```

## Generate htpasswd username/password combination

If you wish to handle access control using htpasswd file, you can generate
username/password combination form
[here](http://www.htaccesstools.com/htpasswd-generator/) and add it to htpasswd
file.

## How does it work?

The htpasswd file contains rows corresponding to a pair of username and password
separated with a colon character. The password is encrypted using the UNIX system's
crypt method and may use MD5 or SHA1.

## Plugin Development in Verdaccio

There are many ways to extend [Verdaccio](https://github.com/verdaccio/verdaccio),
currently it support authentication plugins, middleware plugins (since v2.7.0)
and storage plugins since (v3.x).

#### Useful Links

- [Plugin Development](http://www.verdaccio.org/docs/en/dev-plugins.html)
- [List of Plugins](http://www.verdaccio.org/docs/en/plugins.html)

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-htpasswd.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-htpasswd?ref=badge_large)
