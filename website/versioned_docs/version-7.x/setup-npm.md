---
id: setup-npm
title: 'npm'
---

# npm {#npm}

The minimum supported NPM version is 5.

## Setting up global registry for all projects {#all}

To set the registry for all your local projects in any terminal window run:

```bash
npm set registry http://localhost:4873/
```

This will set the registry for your operational system user and you can find it on the file `~/.npmrc`.

## Using registry for a specific project {#specific}

To set this value for a specific project open its root folder on a terminal window and run:

```bash
npm set registry http://localhost:4873/ --location project
```

This will set the registry in a `.npmrc` file in your project root directory.

or by specific scope eg: `@my-scope/auth`:

```
npm config set @my-scope:registry http://localhost:4873
```

## Using registry only on specific command {#command}

If you want one single use append `--registry http://localhost:4873/` to the required command.
Some examples:

```bash
npm ci --registry http://localhost:4873
npm install --registry http://localhost:4873
npm install lodash --registry http://localhost:4873
```

## How to prevent your package from being published in other registries

If you only want to publish your package to Verdaccio but keep installing from other registries you can setup the `publishConfig` in your `package.json` as [described in the official documentation](https://docs.npmjs.com/cli/v8/using-npm/registry#how-can-i-prevent-my-package-from-being-published-in-the-official-registry).

```json
{
  "publishConfig": {
    "registry": "http://localhost:4873"
  }
}
```

## Creating user {#creating-user}

With npm 8 or below, either `adduser` or `login` are able to create users and login at the same time.

```bash
npm adduser --registry http://localhost:4873
```

after version `npm@9` the commands works separately:

- `login` does not create users.

```bash
npm login --registry http://localhost:4873
```

- `adduser` does not login users.

```bash
npm adduser --registry http://localhost:4873
```

Both commands relies on web login by default, but adding `--auth-type=legacy` you can get back the previous behaviour.

> [Web login is not supported for verdaccio.](https://github.com/verdaccio/verdaccio/issues/3413)

## Troubleshooting {#troubleshooting}

### `npm login` with npm@9 or higher

If you are running into issues login with `npm@9.x` or higher you could try use the legacy mode (see above).

For progress on the native support on future you can track the following [issue#3413](https://github.com/verdaccio/verdaccio/issues/3413).

### npm does not save authToken when authenticating to Verdaccio

If you are using either `npm@5.4.x` or `npm@5.5.x`, there are [known issues with tokens](https://github.com/verdaccio/verdaccio/issues/509#issuecomment-359193762), please upgrade to either `6.x` or downgrade to `npm@5.3.0`.

### SSL and certificates {#ssl-and-certificates}

When using Verdaccio under SSL without a valid certificate, defining `strict-ssl` in your config file is required otherwise you will get `SSL Error: SELF_SIGNED_CERT_IN_CHAIN` errors.

`npm` does not support [invalid certificates anymore](https://blog.npmjs.org/post/78085451721/npms-self-signed-certificate-is-no-more) since 2014.

```bash
npm config set ca ""
npm config set strict-ssl false
```

### Mixed registries in lockefile (npm v7+)

Since version 7 npm got more strict with the introduction of `lockfileVersion: 2`. If you have mixed `resolved` fields in your lockfile, for instance, having this in your lockfile:

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
