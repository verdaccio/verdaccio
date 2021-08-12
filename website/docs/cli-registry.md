---
id: cli-registry
title: "Using a private registry"
---

Setting up a private registry can be achieved in a few ways, let's review all of them. The following commands might be different based on the package manager you are using.

### npm (5.x, 6.x) {#npm-5x-6x}

To set the registry in the `.npmrc` file use the following:

```bash
npm set registry http://localhost:4873/
```

If you want one single use `--registry` after the required command.

```bash
npm install --registry http://localhost:4873
```

Write it yourself by defining in your `.npmrc` a `registry` field.

```bash title=".npmrc"
registry=http://localhost:4873
```

> Since `npm@5.x` [ignores the `resolve` field in defined in the lock files](https://medium.com/verdaccio/verdaccio-and-deterministic-lock-files-5339d82d611e), while `pnpm@4.x` and `yarn@1.x` does the opposite.

Or a `publishConfig` in your `package.json`

```json
{
  "publishConfig": {
    "registry": "http://localhost:4873"
  }
}
```

> By using the `publishConfig` the previous two options would be ignored, only use this option if you want to ensure the package is not being published anywhere else.

If you are using either `npm@5.4.x` or `npm@5.5.x`, there are [known issues with tokens](https://github.com/verdaccio/verdaccio/issues/509#issuecomment-359193762), please upgrade to either `6.x` or downgrade to `npm@5.3.0`.

#### SSL and certificates {#ssl-and-certificates}

When using Verdaccio under SSL without a valid certificate, defining `strict-ssl` in your config file is required otherwise you will get `SSL Error: SELF_SIGNED_CERT_IN_CHAIN` errors.

`npm` does not support [invalid certificates anymore](https://blog.npmjs.org/post/78085451721/npms-self-signed-certificate-is-no-more) since 2014.

```bash
npm config set ca ""
npm config set strict-ssl false
```

### npm (7.x) {#npm-7x}

npm `v7.0.0` is more strict with the new `v2` lockfile. If you have mixed `resolved` fields in your lockfile, for instance, having this in your lockfile:

```json
{
  "name": "npm7",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "packages": {
    "": {
      "version": "1.0.0",
      "license": "ISC",
      "dependencies": {
        "lodash": "4.17.20",
        "underscore": "^1.11.0"
      }
    },
    ..... // removed for simplicity
  },
  "dependencies": {
    "lodash": {
      "version": "4.17.20",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.20.tgz",
      "integrity": "sha512-PlhdFcillOINfeV7Ni6oF1TAEayyZBoZ8bcshTHqOYJYlrqzRK5hagpagky5o4HfCzzd1TRkXPMFq6cKk9rGmA=="
    },
    "underscore": {
      "version": "1.11.0",
      "resolved": "http://localhost:4873/underscore/-/underscore-1.11.0.tgz",
      "integrity": "sha512-xY96SsN3NA461qIRKZ/+qox37YXPtSBswMGfiNptr+wrt6ds4HaMw23TP612fEyGekRE6LNRiLYr/aqbHXNedw=="
    }
  }
}
```

Either running `npm i --registry https://registry.npmjs.org` or using `.npmrc` will fail your installation.

### yarn {#yarn}

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

When you publish a package the ``must be used, keep on mind the`publishConfig.registry`in the`package.json` will override this configuration.

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

### pnpm {#pnpm}

> This includes 4.x and 5.x series.

`pnpm` recognize by default the configuration at `.npmrc` and also the `--registry` value, there is no difference in the implementation.
