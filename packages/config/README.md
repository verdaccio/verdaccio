# @verdaccio/config - Verdaccio Configuration

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)
[![This Package Latest](https://img.shields.io/npm/v/@verdaccio/config?label=@verdaccio/config&color=405236)](https://npmjs.com/package/@verdaccio/config)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)
[![Bluesky](https://img.shields.io/badge/Follow-Bluesky?style=flat&logo=Bluesky&label=Bluesky&color=cd4000)](https://bsky.app/profile/verdaccio.org)
[![Backers](https://img.shields.io/opencollective/backers/verdaccio?style=flat&logo=opencollective&label=Join%20Backers&color=cd4000)](https://opencollective.com/verdaccio/contribute)
[![Sponsors](https://img.shields.io/opencollective/sponsors/verdaccio?style=flat&logo=opencollective&label=Sponsor%20Us&color=cd4000)](https://opencollective.com/verdaccio/contribute)

[![Verdaccio Downloads](https://img.shields.io/npm/dm/verdaccio?style=flat&logo=npm&label=Npm%20Downloads&color=lightgrey)](https://www.npmjs.com/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio?style=flat&logo=docker&label=Docker%20Pulls&color=lightgrey)](https://hub.docker.com/r/verdaccio/verdaccio)
[![GitHub Stars](https://img.shields.io/github/stars/verdaccio?style=flat&logo=github&label=GitHub%20Stars%20%E2%AD%90&color=lightgrey)](https://github.com/verdaccio/verdaccio/stargazers)

## Overview

The `@verdaccio/config` package provides a powerful configuration builder constructor for programmatically creating configuration objects for Verdaccio, a lightweight private npm proxy registry. With this package, users can easily manage various configuration aspects such as package access, uplinks, security settings, authentication, logging, and storage options.

## Installation

You can install via npm:

```bash
npm install @verdaccio/config
```

## Usage

To start using `@verdaccio/config`, import the `ConfigBuilder` class and begin constructing your configuration object:

## `ConfigBuilder` constructor

The `ConfigBuilder` class is a helper configuration builder constructor used to programmatically create configuration objects for testing or other purposes. All setter methods return `this` for fluent chaining.

```typescript
import { ConfigBuilder } from '@verdaccio/config';
import { constants } from '@verdaccio/core';

const config = ConfigBuilder.build()
  .addStorage('./storage')
  .addSecurity({
    api: {
      jwt: { sign: { expiresIn: '7d' }, verify: {} },
      legacy: false,
    },
    web: {
      sign: { expiresIn: '1h' },
      verify: {},
    },
  })
  .addAuth({
    htpasswd: { file: '.htpasswd' },
  })
  .addUplink('npmjs', { url: 'https://registry.npmjs.org/' })
  .addPackageAccess('@scope/*', {
    access: constants.ROLES.$AUTH,
    publish: constants.ROLES.$AUTH,
    proxy: 'npmjs',
  })
  .addWeb({ title: 'My Registry', darkMode: true, primaryColor: '#4b5e40' })
  .addLogger({ type: 'stdout', format: 'pretty', level: 'info' })
  .addMiddlewares({ audit: { enabled: true } })
  .addFlags({ changePassword: true })
  .addI18n({ web: 'en-US' });

// Get the configuration object
const configObj = config.getConfig();

// Get the configuration as YAML text
const configYaml = config.getAsYaml();
```

You can also pass an initial partial configuration to `ConfigBuilder.build()`:

```typescript
const config = ConfigBuilder.build({ security: { api: { legacy: false } } });
```

### Methods

- `addPackageAccess(pattern: string, pkgAccess: PackageAccessYaml)`: Adds package access configuration for a pattern.
- `addUplink(id: string, uplink: UpLinkConf)`: Adds an uplink configuration.
- `addSecurity(security: Partial<Security>)`: Merges security configuration.
- `addAuth(auth: Partial<AuthConf>)`: Merges authentication configuration.
- `addLogger(log: LoggerConfigItem)`: Sets logger configuration.
- `addServer(server: Partial<ServerSettingsConf>)`: Merges server settings.
- `addStorage(storage: string | object)`: Sets storage path (string) or store plugin configuration (object).
- `addWeb(web: Partial<WebConf>)`: Merges web UI configuration.
- `addListen(listen: ListenAddress)`: Sets listen address.
- `addHttps(https: HttpsConf)`: Sets HTTPS configuration.
- `addPublish(publish: Partial<PublishOptions>)`: Merges publish options.
- `addFlags(flags: Partial<FlagsConfig>)`: Merges feature flags.
- `addNotify(notify: Notifications | Notifications[])`: Sets notification hooks.
- `addMiddlewares(middlewares: any)`: Merges middlewares configuration.
- `addFilters(filters: any)`: Merges filters configuration.
- `addMaxBodySize(maxBodySize: string)`: Sets the max body size (e.g., `'50mb'`).
- `addUserRateLimit(rateLimit: RateLimit)`: Merges user rate limit settings.
- `addUrlPrefix(urlPrefix: string)`: Sets URL prefix.
- `addI18n(i18n: ConfigYaml['i18n'])`: Sets i18n configuration.
- `addUserAgent(userAgent: string)`: Sets the user agent string.
- `addHttpProxy(httpProxy: string)`: Sets the HTTP proxy.
- `addHttpsProxy(httpsProxy: string)`: Sets the HTTPS proxy.
- `addNoProxy(noProxy: string)`: Sets the no-proxy exclusion list.
- `addPlugins(plugins: string)`: Sets the plugins directory path.
- `addNotifications(notifications: Notifications)`: Sets notifications configuration.
- `getConfig(): ConfigYaml`: Retrieves the configuration object.
- `getAsYaml(): string`: Retrieves the configuration as YAML format.

## Using `ConfigBuilder` with `runServer`

The `ConfigBuilder` pairs with `runServer` from the `verdaccio` package to start a registry programmatically:

```typescript
import { runServer } from 'verdaccio';

import { ConfigBuilder } from '@verdaccio/config';
import { constants } from '@verdaccio/core';

const config = ConfigBuilder.build()
  .addStorage('./storage')
  .addAuth({ htpasswd: { file: '.htpasswd' } })
  .addUplink('npmjs', { url: 'https://registry.npmjs.org/' })
  .addPackageAccess(constants.PACKAGE_ACCESS.SCOPE, {
    access: constants.ROLES.$AUTH,
    publish: constants.ROLES.$AUTH,
    proxy: 'npmjs',
  })
  .addPackageAccess(constants.PACKAGE_ACCESS.ALL, {
    access: constants.ROLES.$ALL,
    publish: constants.ROLES.$AUTH,
    proxy: 'npmjs',
  })
  .addWeb({ title: 'My Registry', darkMode: true })
  .addMiddlewares({ audit: { enabled: true } })
  .addLogger({ type: 'stdout', format: 'pretty', level: 'info' })
  .addSecurity({
    api: { jwt: { sign: { expiresIn: '7d' }, verify: {} }, legacy: false },
    web: { sign: { expiresIn: '1h' }, verify: {} },
  })
  .addI18n({ web: 'en-US' });

runServer(config.getConfig())
  .then((app) => {
    app.listen(4873, () => {
      console.log('verdaccio running on port 4873');
    });
  })
  .catch((err) => {
    console.error(err);
  });
```

## `getDefaultConfig`

This method is available in the package's index and retrieves the default configuration object.

```typescript
import { getDefaultConfig } from '@verdaccio/config';

const defaultConfig = getDefaultConfig();
```

## Other Methods

- `fromJStoYAML(config: ConfigYaml): string`: Converts a JavaScript configuration object to YAML format.
- `parseConfigFile(filePath: string): ConfigYaml`: Parses a configuration file from the specified path and returns the configuration object.

## Donations

Verdaccio is run by **volunteers**; nobody is working full-time on it. If you find this project to be useful and would like to support its development, consider making a donation - **your logo might end up in this readme.** 😉

**[Donate](https://opencollective.com/verdaccio)** 💵👍🏻 starting from _\$1/month_ or just one single contribution.

## Report a vulnerability

If you want to report a security vulnerability, please follow the steps which we have defined for you in our [security policy](https://github.com/verdaccio/verdaccio/security/policy).

## Open Collective Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/verdaccio/contribute)]

[![sponsor](https://opencollective.com/verdaccio/sponsor/0/avatar.png)](https://opencollective.com/verdaccio/sponsor/0/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/1/avatar.png)](https://opencollective.com/verdaccio/sponsor/1/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/2/avatar.png)](https://opencollective.com/verdaccio/sponsor/2/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/3/avatar.png)](https://opencollective.com/verdaccio/sponsor/3/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/4/avatar.png)](https://opencollective.com/verdaccio/sponsor/4/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/5/avatar.png)](https://opencollective.com/verdaccio/sponsor/5/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/6/avatar.png)](https://opencollective.com/verdaccio/sponsor/6/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/7/avatar.png)](https://opencollective.com/verdaccio/sponsor/7/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/8/avatar.png)](https://opencollective.com/verdaccio/sponsor/8/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/9/avatar.png)](https://opencollective.com/verdaccio/sponsor/9/website)

## Open Collective Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/verdaccio/contribute)]

[![backers](https://opencollective.com/verdaccio/backers.svg?width=890)](https://opencollective.com/verdaccio/contributes)

## Special Thanks

Thanks to the following companies to help us to achieve our goals providing free open source licenses.

[![jetbrains](https://github.com/verdaccio/verdaccio/blob/master/assets/thanks/jetbrains/logo.jpg?raw=true)](https://www.jetbrains.com/)
[![crowdin](https://github.com/verdaccio/verdaccio/blob/master/assets/thanks/crowdin/logo.png?raw=true)](https://crowdin.com/)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md)].

[![contributors](https://opencollective.com/verdaccio/contributors.svg?width=890&button=true)](https://github.com/verdaccio/verdaccio/graphs/contributors)

## FAQ / Contact / Troubleshoot

If you have any issue you can try the following options. Do not hesitate to ask or check our issues database. Perhaps someone has asked already what you are looking for.

- [Blog](https://verdaccio.org/blog/)
- [Donations](https://opencollective.com/verdaccio)
- [Reporting an issue](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
- [Running discussions](https://github.com/orgs/verdaccio/discussions)
- [Chat](https://discord.com/channels/388674437219745793)
- [Logos](https://verdaccio.org/docs/logo)
- [Docker Examples](https://github.com/verdaccio/verdaccio/tree/master/docker-examples)
- [FAQ](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)

## License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)

The Verdaccio documentation and logos (excluding /thanks, e.g., .md, .png, .sketch files within the /assets folder) are
[Creative Commons licensed](https://creativecommons.org/licenses/by/4.0/).
