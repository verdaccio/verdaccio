---
id: best
title: "Best Practices"
---

The following guide is a list of the best practices collected and that we usually recommend to all users. Do not take this guide as
mandatory, you might pick some of them according your needs.

**Feel free to suggest your best practices to the Verdaccio community**.

## Private Registry {#private-registry}

You can add users and manage which users can access which packages.

It is recommended that you define a prefix for your private packages, for example `local-*` or scoped `@my-company/*`, so all your private things will look like this: `local-foo`. This way you can clearly separate public packages from private ones.

```yaml
 packages:
   '@my-company/*':
     access: $all
     publish: $authenticated
    'local-*':
     access: $all
     publish: $authenticated
   '@*/*':
     access: $all
     publish: $authenticated
   '**':
     access: $all
     publish: $authenticated
```

Always remember, **the order of packages access is important**, packages are matched always top to bottom.

### Using public packages from npmjs.org {#using-public-packages-from-npmjsorg}

If a package doesn't exist in the storage, the server will try to fetch it from npmjs.org. If npmjs.org is down, it serves packages from the cache pretending that no other packages exist. **Verdaccio will download only what's needed (requested by clients)**, and this information will be cached, so if the client requests the same thing a second time it can be served without asking npmjs.org for it.

**Example:**

If you successfully request `express@4.0.1` from the server once, you'll be able to do it again (with all of it's dependencies) any time, even if npmjs.org is down. Though note that `express@4.0.0` will not be downloaded until it's actually needed by somebody. And if npmjs.org is offline, the server will say that only `express@4.0.1` (what's in the cache) is published, but nothing else.

### Override public packages {#override-public-packages}

If you want to use a modified version of some public package `foo`, you can just publish it to your local server, so when your type `npm install foo`, **it'll consider installing your version**.

There's two options here:

1. You want to create a separate **fork** and stop synchronizing with public version.

   If you want to do that, you should modify your configuration file so Verdaccio won't make requests regarding this package to npmjs anymore. Add a separate entry for this package to `config.yaml` and remove `npmjs` from `proxy` list and restart the server.

   ```yaml
   packages:
     "@my-company/*":
       access: $all
       publish: $authenticated
       # comment it out or leave it empty
       # proxy:
   ```

   When you publish your package locally, **you should probably start with a version string higher than the existing package** so it won't conflict with that package in the cache.

2. You want to temporarily use your version, but return to the public one as soon as it's updated.

   In order to avoid version conflicts, **you should use a custom pre-release suffix of the next patch version**. For example, if a public package has version 0.1.2, you can upload `0.1.3-my-temp-fix`.

   ```bash
    npm version 0.1.3-my-temp-fix
    npm publish --tag fix --registry http://localhost:4873
   ```

   This way your package will be used until its original maintainer updates his public package to `0.1.3`.

## Security {#security}

> Security starts in your environment.

<iframe width="560" height="315" src="https://www.youtube.com/embed/qTRADSp3Hpo?enablejsapi=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Additonal reading:

- **[10 npm Security Best Practices](https://snyk.io/blog/ten-npm-security-best-practices/)** and following the steps outlined there.
- **[Avoiding npm substitution attacks](https://github.blog/2021-02-12-avoiding-npm-substitution-attacks/)**
- **[Dependency Confusion: When Are Your npm Packages Vulnerable?](https://blog.includesecurity.com/2021/02/dependency-confusion-when-are-your-npm-packages-vulnerable/)**
- **[Practical Mitigations For Dependency Confusion Attack](https://www.kernelcrypt.com/posts/depedency-confusion-explained/)**
> Feel free to attach here new useful articles to improve the security.

### Strong package access with `$authenticated` {#strong-package-access-with-authenticated}

By default all packages you publish in Verdaccio are accessible for all users. We recommend protecting your registry from external non-authorized users by updating the `access` property of your packages to `$authenticated`.

```yaml
packages:
  "@my-company/*":
    access: $authenticated
    publish: $authenticated
  "@*/*":
    access: $authenticated
    publish: $authenticated
  "**":
    access: $authenticated
    publish: $authenticated
```

That way, **nobody can access your registry unless they are authorized, and private packages won't be displayed in the web interface**.

### Remove `proxy` to increase security at private packages {#remove-proxy-to-increase-security-at-private-packages}

After a clean installation, by default all packages will be resolved to the default uplink (the public registry `npmjs`).

```yaml
packages:
  "@*/*":
    access: $authenticated
    publish: $authenticated
    proxy: npmjs
  "**":
    access: $authenticated
    publish: $authenticated
    proxy: npmjs
```

This means, if a private packaged eg: `@my-company/auth` is published locally, the registry will look up at the public registry. If your intention is fully protection, remove the `proxy` property from your configuration, for instance:

```yaml
packages:
  "@my-company/*":
    access: $authenticated
    publish: $authenticated
    unpublish: $authenticated
  "@*/*":
    access: $authenticated
    publish: $authenticated
    proxy: npmjs
  "**":
    access: $authenticated
    publish: $authenticated
    proxy: npmjs
```

This configuration will **avoid downloading needlessly to external registries**, merging external metadata and download external tarballs.

## Server {#server}

### Secured Connections {#secured-connections}

Using **HTTPS** is a common recommendation. For this reason we recommend reading the [SSL](ssl.md) section to make Verdaccio secure, or alternatively using an HTTPS [reverse proxy](reverse-proxy.md) on top of Verdaccio.

### Expiring Tokens {#expiring-tokens}

Since `verdaccio@3.x` the tokens have no expiration date. For such reason we introduced in the next `verdaccio@4.x` the JWT feature [PR#896](https://github.com/verdaccio/verdaccio/pull/896)

```yaml
security:
  api:
    jwt:
      sign:
        expiresIn: 15d
        notBefore: 0
  web:
    sign:
      expiresIn: 7d
```

**Using this configuration will override the current system and you will be able to control how long the token will live**.

Using JWT also improves the performance with authentication plugins. The old system will perform an unpackage and validate the credentials on every request, while JWT will rely on the token signature instead, avoiding the overhead for the plugin.

As a side note, be aware at **npmjs** and the **legacy** verdaccio token never expires\*\* unless you invalidate manually.
