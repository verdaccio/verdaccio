---
id: plugins
title: 'Plugins'
---

Verdaccio is a pluggable application. It can be extended in many ways, either new authentication methods, adding endpoints or using a custom storage.

There are 5 types of plugins:

- [Authentication](plugin-auth.md)
- [Middleware](plugin-middleware.md)
- [Storage](plugin-storage.md)
- [Theme UI](plugin-theme.md)
- [Filters](plugin-filter.md)

## Usage {#usage}

### Installation {#installation}

```bash
$> npm install --global verdaccio-activedirectory
```

`verdaccio` as a sinopia fork it has backward compatibility with plugins that are compatible with `sinopia@1.4.0`. In such case the installation is the same.

```
$> npm install --global sinopia-memory
```

### Configuration {#configuration}

Open the `config.yaml` file and update the `auth` section as follows:

The default configuration looks like this, due we use a build-in `htpasswd` plugin by default that you can disable just commenting out the following lines.

### Naming convention {#naming-convention}

Since version `2.0.0` until version plugins must start with the following convention:

- `sinopia-xxx` (deprecated and will be removed on 6.x.x)
- `verdaccio-xxx`

After version `5.12.0` scoped plugins are supported, for example:

```yaml
auth:
  '@my-org/auth-awesome-plugin':
    foo: some value
    bar: another value
store:
  '@my-org/store-awesome-plugin':
    foo: some value
    bar: another value
middleware:
  '@my-org/middleware-awesome-plugin':
    foo: some value
    bar: another value
```

### Authentication Configuration {#authentication-configuration}

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    # max_users: 1000
```

and replacing them with (in case you decide to use a `ldap` plugin.

```yaml
auth:
  activedirectory:
    url: 'ldap://10.0.100.1'
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

#### Multiple Authentication plugins {#multiple-authentication-plugins}

This is technically possible, making the plugin order important, as the credentials will be resolved in order.

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    #max_users: 1000
  activedirectory:
    url: 'ldap://10.0.100.1'
    baseDN: 'dc=sample,dc=local'
    domainSuffix: 'sample.local'
```

### Middleware Configuration {#middleware-configuration}

Example how to set up a middleware plugin. All middleware plugins must be defined in the **middlewares** namespace.

```yaml
middlewares:
  audit:
    enabled: true
```

> You might follow the [audit middle plugin](https://github.com/verdaccio/verdaccio-audit) as base example.

### Storage Configuration {#storage-configuration}

:::caution

If the `store` property is defined in the `config.yaml` file, the `storage` property is being ignored.

:::caution

Example how to set up a storage plugin. All storage plugins must be defined in the **store** namespace.

```yaml
store:
  memory:
    limit: 1000
```

### Theme Configuration {#theme-configuration}

```bash
npm install --global verdaccio-theme-dark
```

You can load only one theme at a time and pass through options if you need it.

```yaml
theme:
  dark:
    option1: foo
    option2: bar
```

### Filter Configuration (Experimental) {#filter-configuration}

A real example from [npm i -g verdaccio-plugin-secfilter](https://github.com/Ansile/verdaccio-plugin-secfilter) filter plugin.

```yaml
filters:
  plugin-secfilter:
    block:
      - scope: @evil # block all packages in scope
      - package: semvver # block a malicious package
      - package: @coolauthor/stolen
        versions: '>2.0.1' # block some malicious versions of previously ok package
                           # uses https://www.npmjs.com/package/semver syntax
```

## Legacy plugins {#legacy-plugins}

### Sinopia Plugins {#sinopia-plugins}

:::caution

After version 6 sinopia plugins are not longer supported due the naming convention.

:::caution

> If you are relying on any sinopia plugin, remember are deprecated and might no work in the future.

- [sinopia-npm](https://www.npmjs.com/package/sinopia-npm): auth plugin for sinopia supporting an npm registry.
- [sinopia-memory](https://www.npmjs.com/package/sinopia-memory): auth plugin for sinopia that keeps users in memory.
- [sinopia-github-oauth-cli](https://www.npmjs.com/package/sinopia-github-oauth-cli).
- [sinopia-crowd](https://www.npmjs.com/package/sinopia-crowd): auth plugin for sinopia supporting atlassian crowd.
- [sinopia-activedirectory](https://www.npmjs.com/package/sinopia-activedirectory): Active Directory authentication plugin for sinopia.
- [sinopia-github-oauth](https://www.npmjs.com/package/sinopia-github-oauth): authentication plugin for sinopia2, supporting github oauth web flow.
- [sinopia-delegated-auth](https://www.npmjs.com/package/sinopia-delegated-auth): Sinopia authentication plugin that delegates authentication to another HTTP URL
- [sinopia-altldap](https://www.npmjs.com/package/sinopia-altldap): Alternate LDAP Auth plugin for Sinopia
- [sinopia-request](https://www.npmjs.com/package/sinopia-request): An easy and fully auth-plugin with configuration to use an external API.
- [sinopia-htaccess-gpg-email](https://www.npmjs.com/package/sinopia-htaccess-gpg-email): Generate password in htaccess format, encrypt with GPG and send via MailGun API to users.
- [sinopia-mongodb](https://www.npmjs.com/package/sinopia-mongodb): An easy and fully auth-plugin with configuration to use a mongodb database.
- [sinopia-htpasswd](https://www.npmjs.com/package/sinopia-htpasswd): auth plugin for sinopia supporting htpasswd format.
- [sinopia-leveldb](https://www.npmjs.com/package/sinopia-leveldb): a leveldb backed auth plugin for sinopia private npm.
- [sinopia-gitlabheres](https://www.npmjs.com/package/sinopia-gitlabheres): Gitlab authentication plugin for sinopia.
- [sinopia-gitlab](https://www.npmjs.com/package/sinopia-gitlab): Gitlab authentication plugin for sinopia
- [sinopia-ldap](https://www.npmjs.com/package/sinopia-ldap): LDAP auth plugin for sinopia.
- [sinopia-github-oauth-env](https://www.npmjs.com/package/sinopia-github-oauth-env) Sinopia authentication plugin with github oauth web flow.

> All sinopia plugins should be compatible with all future verdaccio versions. Anyhow, we encourage contributors to migrate them to the
> modern verdaccio API and using the prefix as _verdaccio-xx-name_.
