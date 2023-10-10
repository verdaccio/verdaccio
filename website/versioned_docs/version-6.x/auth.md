---
id: authentication
title: 'Authentication'
---

The authentication is tied to the auth [plugin](plugins.md) you are using. The package restrictions are also handled by the [Package Access](packages.md).

The client authentication is handled by the `npm` client itself. Once you log in to the application:

```bash
npm adduser --registry http://localhost:4873
```

A token is generated in the `npm` configuration file hosted in your user home folder. For more information about `.npmrc` read the [official documentation](https://docs.npmjs.com/files/npmrc).

```bash
cat .npmrc
registry=http://localhost:5555/
//localhost:5555/:_authToken="secretVerdaccioToken"
//registry.npmjs.org/:_authToken=secretNpmjsToken
```

#### Anonymous publish {#anonymous-publish}

`verdaccio` allows you to enable anonymous publish. To achieve that you will need to correctly set up your [packages access](packages.md).

Eg:

```yaml
'my-company-*':
  access: $anonymous
  publish: $anonymous
  proxy: npmjs
```

As is described [on issue #212](https://github.com/verdaccio/verdaccio/issues/212#issuecomment-308578500) until `npm@5.3.0` and all minor releases **won't allow you publish without a token**.

## Understanding Groups {#understanding-groups}

### The meaning of `$all` and `$anonymous` {#the-meaning-of-all-and-anonymous}

As you know _Verdaccio_ uses `htpasswd` by default. That plugin does not implement the methods `allow_access`, `allow_publish` and `allow_unpublish`.
Thus, _Verdaccio_ will handle that in the following way:

- If you are not logged in (you are anonymous), `$all` and `$anonymous` means exactly the same.
- If you are logged in, `$anonymous` won't be part of your groups and `$all` will match any logged user. A new group `$authenticated` will be added to your group list.

Please note: `$all` **will match all users, whether logged in or not**.

**The previous behavior only applies to the default authentication plugin**. If you are using a custom plugin and such plugin implements
`allow_access`, `allow_publish` or `allow_unpublish`, the resolution of the access depends on the plugin itself. Verdaccio will only set the default groups.

Let's recap:

- **logged in**: `$all` and `$authenticated` + groups added by the plugin.
- **logged out (anonymous)**: `$all` and `$anonymous`.

## Default htpasswd {#default-htpasswd}

In order to simplify the setup, `verdaccio` uses a plugin based on `htpasswd`. Since version v3.0.x the `verdaccio-htpasswd` plugin
is used by default.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    # max_users: 1000
    # Hash algorithm, possible options are: "bcrypt", "md5", "sha1", "crypt".
    algorithm: bcrypt # by default is crypt, but is recommended use bcrypt for new installations
    # Rounds number for "bcrypt", will be ignored for other algorithms.
    rounds: 10
```

> The default algorithm is `crypt`, considered not secure for production environments, it's recommended for new installations use `bcrypt` instead. Note after verdaccio 6.x
> the default will be `bcrypt`.

| Property  | Type   | Required | Example               | Support  | Description                                                      |
| --------- | ------ | -------- | --------------------- | -------- | ---------------------------------------------------------------- |
| file      | string | Yes      | ./htpasswd            | all      | file that host the encrypted credentials                         |
| max_users | number | No       | 1000                  | all      | set limit of users                                               |
| algorithm | string | No       | bcrypt/md5/sha1/crypt | >=5.13.0 | set hasing password algorithm                                    |
| rounds    | number | No       | 10                    | >=5.13.0 | Rounds number for "bcrypt", will be ignored for other algorithms |

> In case you decide to prevent users from signing up themselves, you can set `max_users: -1`.
