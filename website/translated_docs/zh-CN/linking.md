---
id: linking-remote-registry
title: "链接远程Registry"
---

Verdaccio将会代理，并在默认情况下链接公共registry。

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

你可以关联多个registries，下述文档将会用一些有帮助的配置指引你。

## 使用关联范围

使用多个registries的唯一可行的方式，就是使用`.npmrc`。其功能如下：

```
// .npmrc
registry=https://registry.npmjs.org
@mycompany:registry=http://localhost:4873
```

This approach is valid, but comes with several disadvantages:

* It **only works with scopes**
* Scope must match, **no Regular Expressions are allowed**
* One scope **cannot fetch from multiple registries**
* Tokens/passwords **must be defined within** `.npmrc` and checked in into the repo.

See a full example [here](https://stackoverflow.com/questions/54543979/npmrc-multiple-registries-for-the-same-scope/54550940#54550940).

## Linking a Registry

Linking a registry is fairly simple. First, define a new section in the `uplinks` section. Note, the order here is irrelevant.

```yaml
  uplinks:
    private:
      url: https://private.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: private

```

Add a `proxy` section to define the selected registry you want to proxy.

## Linking Multiple Registries

```yaml
  uplinks:
    server1:
      url: https://server1.registry.net/npm
    server2:
      url: https://server2.registry.net/npm

    ... [truncated] ...

  'webpack':
    access: $all
    publish: $authenticated
    proxy: server1 server2

  'webpack':
    access: $all
    publish: $authenticated
    proxy: server1 server2
```

Verdaccio supports multiple registries on the `proxy` field. The request will be resolved with the first in the list; if that fails, it will try with the next in the list and so on.

## Offline Registry

Having a full Offline Registry is completely possible. If you don't want any connectivity with external remotes you can do the following.

```yaml

auth:
  htpasswd:
    file: ./htpasswd
uplinks:
packages:
  '@my-company/*':
    access: $all
    publish: none
  '@*/*':
    access: $all
    publish: $authenticated
  '**':
    access: $all
    publish: $authenticated
```

Remove all `proxy` fields within each section of `packages`. The registry will become full offline.
