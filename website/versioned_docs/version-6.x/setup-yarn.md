---
id: setup-yarn
title: 'yarn'
---

# yarn {#yarn}

#### Yarn (1.x) {#yarn-1x}

> Be aware npm configurations are valid on the classic version

The classic version is able to regonize the `.npmrc` file, but also provides their own configuration file named `.yarnrc`.

To set up a registry, create a file and define a registry.

```
// .yarnrc
registry "http://localhost:4873"
```

By using this version you should enable `always-auth` in your configuration running:

```
npm config set always-auth true
```

`yarn@1.x` does not send the authorization header on `yarn install` if your packages requires authentication, by enabling `always-auth` will force yarn do it on each request.

#### Yarn Berry (>=2.x) {#yarn-berry-2x}

> Yarn berry does not recognize `--registry` or `.npmrc` file anymore.

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
