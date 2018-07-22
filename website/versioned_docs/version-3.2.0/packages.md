---
id: version-3.2.0-packages
title: Package Access
original_id: packages
---

It's a series of contraints that allow or restrict access to the local storage based in specific criteria.

The security constraints remain on the shoulders of the plugin being used, by default `verdaccio` uses the [htpasswd plugin](https://github.com/verdaccio/verdaccio-htpasswd). If you use a different plugin the behaviour might be different. The default plugin does not handle `allow_access` and `allow_publish` by itself, it uses an internal fallback in case the plugin is not ready for it.

For more information about permissions visit [the authentification section in the wiki](auth.md).

### Usage

```yalm
packages:
  # scoped packages
  '@scope/*':
    access: all
    publish: all
    proxy: server2

  'private-*':
    access: all
    publish: all
    proxy: uplink1

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    access: all
    publish: all
    proxy: uplink2
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
All users recieve all those set of permissions independently of is anonymous or not plus the groups provided by the plugin, in case of `htpasswd` return the username as a group. For instance, if you are logged as `npmUser` the list of groups will be.

```js
// groups without '$' are going to be deprecated eventually
'$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous', 'npmUser'
```

If you want to protect specific set packages under your group, you need to do something like this. Let's use a `Regex` that covers all prefixed `npmuser-` packages. We recomend using a prefix for your packages, in that way it will be easier to protect them.

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
You can change the existing behaviour using a different plugin authentication. `verdaccio` just checks whether the user that tried to access or publish a specific package belongs to the right group.

#### Set multiple groups

Defining multiple access groups is fairly easy, just define them with a white space between them.

```yaml
  'company-*':
    access: admin internal
    publish: admin
    proxy: server1
  'supersecret-*':
    access: secret super-secret-area ultra-secret-area
    publish: secret ultra-secret-area
    proxy: server1

```

#### Blocking access to set of packages

If you want to block the acccess/publish to a specific group of packages. Just do not define `access` and `publish`.

```yaml
packages:
  'old-*':
  '**':
     access: all
     publish: $authenticated
```
#### Blocking proxying a set of specific packages

You might want to block one or several packages from fetching from remote repositories., but, at the same time, allow others to access different *uplinks*.

Let's see the following example:

```yaml
packages:
  'jquery':
     access: $all
     publish: $all
  'my-company-*':
     access: $all
     publish: $authenticated
  '@my-local-scope/*':
     access: $all
     publish: $authenticated
  '**':
     access: all
     publish: $authenticated
     proxy: npmjs
```
Let's describe what we want with the above example:

* I want to host my own `jquery` dependency but I need to avoid proxying it.
* I want all dependencies that match with `my-company-*` but I need to avoid proxying them.
* I want all dependencies that are in the `my-local-scope` scope but I need to avoid proxying them.
* I want proxying for all the rest of the dependencies.

Be **aware that the order of your packages definitions is important and always use double wilcard**. Because if you do not include it `verdaccio` will include it for you and the way that your dependencies are resolved will be affected.

### Configuration

You can define mutiple `packages` and each of them must have an unique `Regex`.

Property | Type | Required | Example | Support | Description
--- | --- | --- | --- | --- | ---
access | string | No | $all | all | define groups allowed to access the package
publish | string | No | $authenticated | all | define groups allowed to publish
proxy | string | No |npmjs | all | limit look ups for specific uplink
storage | boolean | No | [true,false] | all | TODO

> We higlight that we recommend to not use **allow_access**/**allow_publish** and **proxy_access** anymore, those are deprecated and will soon be removed, please use the short version of each of those (**access**/**publish**/**proxy**).




