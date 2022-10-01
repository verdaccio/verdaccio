---
id: linking-remote-registry
title: "Linking a Remote Registry"
---

Verdaccio is a proxy and by default [links](uplinks.md) the public registry.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

You can link multiple registries, the following document will drive you through some helpful configurations.

## Using Associating Scope {#using-associating-scope}

The unique way to access multiple registries using the `.npmrc` is the scope feature as follows:

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

## Linking a Registry {#linking-a-registry}

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

## Linking Multiple Registries {#linking-multiple-registries}

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
```

Verdaccio supports multiple registries on the `proxy` field. The request will be resolved with the first in the list; if that
fails, it will try with the next in the list and so on.

## Offline Registry {#offline-registry}

Having a full Offline Registry is completely possible. If you don't want any connectivity with external remotes you
can do the following.

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
