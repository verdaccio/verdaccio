# verdaccio-auth-memory

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-auth-memory.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-auth-memory?ref=badge_shield)
[![CircleCI](https://circleci.com/gh/verdaccio/verdaccio-auth-memory.svg?style=svg)](https://circleci.com/gh/ayusharma/verdaccio-auth-memory)
[![codecov](https://codecov.io/gh/verdaccio/verdaccio-auth-memory/branch/master/graph/badge.svg)](https://codecov.io/gh/verdaccio/verdaccio-auth-memory)

This verdaccio auth plugin keeps the users in a memory plain object.
This means all sessions and users will disappear when you restart the verdaccio server.

If you want to use this piece of software, do it at your own risk. **This plugin is being used for unit testing**.

## Installation

```sh
$ npm install -g verdaccio
$ npm install -g verdaccio-auth-memory
```

## Config

Add to your `config.yaml`:

```yaml
auth:
  auth-memory:
    users:
      foo:
        name: foo
        password: s3cret
      bar:
        name: bar
        password: s3cret
```

## For plugin writers

It's called as:

```js
const plugin = require('verdaccio-auth-memory');

plugin(config, appConfig);
```

Where:

- config - module's own config
- appOptions - collection of different internal verdaccio objects
  - appOptions.config - main config
  - appOptions.logger - logger

This should export four functions:

- `adduser(user, password, cb)` Add new users

  It should respond with:

  - `cb(err)` in case of an error (error will be returned to user)
  - `cb(null, false)` in case registration is disabled (next auth plugin will be executed)
  - `cb(null, true)` in case user registered successfully

  It's useful to set `err.status` property to set http status code (e.g. `err.status = 403`).

- `authenticate(user, password, cb)` Authenticate the user

  It should respond with:

  - `cb(err)` in case of a fatal error (error will be returned to user, keep those rare)
  - `cb(null, false)` in case user not authenticated (next auth plugin will be executed)
  - `cb(null, [groups])` in case user is authenticated

  Groups is an array of all users/usergroups this user has access to. You should probably include username itself here.

- `allow_access(user, pkg, cb)` Check whether the user has permissions to access a resource (package)

  It should respond with:

  - `cb(err)` in case of a fatal error (error will be returned to user, keep those rare)
  - `cb(null, false)` in case user not allowed to access (next auth plugin will be executed)
  - `cb(null, true)` in case user is allowed to access

- `allow_publish(user, pkg, cb)` Check whether the user has permissions to publish a resource (package)

  It should respond with:

  - `cb(err)` in case of a fatal error (error will be returned to user, keep those rare)
  - `cb(null, false)` in case user not allowed to publish (next auth plugin will be executed)
  - `cb(null, true)` in case user is allowed to publish

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-auth-memory.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fverdaccio%2Fverdaccio-auth-memory?ref=badge_large)
