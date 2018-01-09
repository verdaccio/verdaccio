---
id: packages
title: Package Access
---
It's a series of contrains that allow or restrict access to the local storage based in specific criteria.

The security constraints remains on shoulders of the plugin being used, by default `verdaccio` uses the `htpasswd` plugin. If you use a different plugin the behaviour might be different. The default plugin `htpasswd` does not handles by itself `allow_access` and `allow_publish`, it's use an internal fallback in case the plugin is not ready for it. For more information about permissions visit [the authentification section in the wiki](auth.md).

### Usage

```yalm
packages:
  # scoped packages
  '@scope/*':
    allow_access: all
    allow_publish: all
    proxy: server2

  'private-*':
    access: all
    publish: all
    proxy_access: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    allow_access: all
    allow_publish: all
    proxy_access: uplink2
```

if none is specified, the default one remains

```yaml
packages:
  '**':
     access: all
     publish: $authenticated
```

The list of valid groups according the default plugins are

```js
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous'
```

All users recieves all those set of permissions independently of is anonymous or not plus the groups provided by the plugin, in case of `htpasswd` return the username as a group. For instance, if you are logged as `npmUser` the list of groups will be.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

If you want to protect specific set packages under your group, you need todo something like this. Let's use a `Regex` that covers all prefixed `npmuser-` packages. We recomend use a prefix for your packages, in that way it'd be easier to protect them.

```yaml
packages:
  'npmuser-*':
     access: npmuser
     publish: npmuser
```

Restart `verdaccio` and in your console try to install `npmuser-core`.

```bash
$ npm install npmuser-core
npm install npmuser-core
npm ERR! code E403
npm ERR! 403 Forbidden: npmuser-core@latest

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/user/.npm/_logs/2017-07-02T12_20_14_834Z-debug.log
```

You can change the existing behaviour using a different plugin authentication. `verdaccio` just check whether the user that try to access or publish specific package belongs to the right group.

#### Set multiple groups

Define multiple access groups is fairly easy, just define them with a white space between them.

```yaml
  'company-*':
    allow_access: admin internal
    allow_publish: admin
    proxy_access: server1
  'supersecret-*':
    allow_access: secret super-secret-area ultra-secret-area
    allow_publish: secret ultra-secret-area
    proxy_access: server1

```

#### Blocking access to set of packages

If you want to block the acccess/publish to a specific group of packages. Just, do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
     access: all
     publish: $authenticated
```

### Configuration

You can define mutiple `packages` and each of them must have an unique `Regex`.

| Property              | Type    | Required | Example        | Support | Description                                 |
| --------------------- | ------- | -------- | -------------- | ------- | ------------------------------------------- |
| allow_access/access   | string  | No       | $all           | all     | define groups allowed to access the package |
| allow_publish/publish | string  | No       | $authenticated | all     | define groups allowed to publish            |
| proxy_access/proxy    | string  | No       | npmjs          | all     | limit look ups for specific uplink          |
| storage               | boolean | No       | [true,false]   | all     | TODO                                        |

We higlight recommend do not use **allow_access**/**allow_publish** and **proxy_access** anymore, those are deprecated, please use the short version of each of those (**access**/**publish**/**proxy**