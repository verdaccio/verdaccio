---
id: setup-yarn
title: 'yarn'
---

# yarn {#yarn}

#### `yarn` classic (1.x) {#yarn-classic-1x}

> Be aware `.npmrc` file configuration is recognized by yarn classic.

The classic version is able to regonise the `.npmrc` file, but also provides their own configuration file named `.yarnrc`.

To set up a registry, create a file and define a registry.

```
// .yarnrc
registry "http://localhost:4873"
```

`yarn@1.x` by default does not send the token on every request unless is being opt-in manually, this might causes `403 error` if you have protected the access of your packages.

To change this behaviour enable `always-auth` in your configuration :

```
always-auth=true
```

or running

```
npm config set always-auth true
```

#### `yarn` modern (>=2.x) {#yarn-modern-2x}

> Yarn modern does not recognize `--registry` or `.npmrc` file anymore.

For defining a registry you must use the `.yarnrc.yml` located in the root of your project or global configuration.

When you publish a package the `npmRegistryServer` must be used. Keep in mind the `publishConfig.registry` in the `package.json` will override this configuration.

```yaml
// .yarnrc.yml
npmRegistryServer: "http://localhost:4873"

unsafeHttpWhitelist:
  - localhost
```

> `unsafeHttpWhitelist` is only need it if you don't use `https` with a valid certificate.

Using scopes is also possible and more segmented, you can define a token peer scope if is required.

```
npmRegistries:
  "https://registry.myverdaccio.org":
    npmAlwaysAuth: true
    npmAuthToken: <TOKEN>
npmScopes:
  my-company:
    npmRegistryServer: https://registry.myverdaccio.org
    npmPublishRegistry: https://registry.myverdaccio.org
```

for logging via CLi use:

```
yarn npm login --scope my-company
```

## Troubleshooting {#troubleshooting}

### Known issues

- `yarn npm login` issues, read [verdaccio#1737](https://github.com/verdaccio/verdaccio/issues/1737) or [yarn-berry#1848](https://github.com/yarnpkg/berry/pull/1848).
- `yarn npm publish` does not send README, read [verdaccio#1905](https://github.com/verdaccio/verdaccio/issues/1905) or [yarn-berry#1702](https://github.com/yarnpkg/berry/issues/1702).
