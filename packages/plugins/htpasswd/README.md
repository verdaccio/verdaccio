# verdaccio-htpasswd - Htpasswd Authentication Plugin for Verdaccio

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)
[![This Package Latest](https://img.shields.io/npm/v/verdaccio-htpasswd?label=verdaccio-htpasswd&color=405236)](https://npmjs.com/package/verdaccio-htpasswd)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)
[![Bluesky](https://img.shields.io/badge/Follow-Bluesky?style=flat&logo=Bluesky&label=Bluesky&color=cd4000)](https://bsky.app/profile/verdaccio.org)
[![Backers](https://img.shields.io/opencollective/backers/verdaccio?style=flat&logo=opencollective&label=Join%20Backers&color=cd4000)](https://opencollective.com/verdaccio/contribute)
[![Sponsors](https://img.shields.io/opencollective/sponsors/verdaccio?style=flat&logo=opencollective&label=Sponsor%20Us&color=cd4000)](https://opencollective.com/verdaccio/contribute)

[![Verdaccio Downloads](https://img.shields.io/npm/dm/verdaccio?style=flat&logo=npm&label=Npm%20Downloads&color=lightgrey)](https://www.npmjs.com/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio?style=flat&logo=docker&label=Docker%20Pulls&color=lightgrey)](https://hub.docker.com/r/verdaccio/verdaccio)
[![GitHub Stars](https://img.shields.io/github/stars/verdaccio?style=flat&logo=github&label=GitHub%20Stars%20%E2%AD%90&color=lightgrey)](https://github.com/verdaccio/verdaccio)

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
            # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
            #algorithm: bcrypt
            # Rounds number for "bcrypt", will be ignored for other algorithms.
            # Setting this value higher will result in password verification taking longer.
            #rounds: 10
            # Log a warning if the password takes more then this duration in milliseconds to verify.
            #slow_verify_ms: 200

### Bcrypt rounds

It is important to note that when using the default `bcrypt` algorithm and setting
the `rounds` configuration value to a higher number then the default of `10`, that
verification of a user password can cause significantly increased CPU usage and
additional latency in processing requests.

If your Verdaccio instance handles a large number of authenticated requests using
username and password for authentication, the `rounds` configuration value may need
to be decreased to prevent excessive CPU usage and request latency.

Also note that setting the `rounds` configuration value to a value that is too small
increases the risk of successful brute force attack. Auth0 has a
[blog article](https://auth0.com/blog/hashing-in-action-understanding-bcrypt)
that provides an overview of how `bcrypt` hashing works and some best practices.

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
