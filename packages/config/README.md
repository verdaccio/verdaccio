# @verdaccio/config

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

The `ConfigBuilder` class is a helper configuration builder constructor used to programmatically create configuration objects for testing or other purposes.

```typescript

import { ConfigBuilder } from '@verdaccio/config';

// Create a new configuration builder instance
const config = ConfigBuilder.build({ security: { api: { legacy: false } } });

// Add package access configuration
configBuilder.addPackageAccess('@scope/*', { access: 'read', publish: 'write' });

// Add an uplink configuration
configBuilder.addUplink('npmjs', { url: 'https://registry.npmjs.org/' });

// Add security configuration
configBuilder.addSecurity({ allow_offline: true });

// Get the configuration object
const config = configBuilder.getConfig();

// Get the configuration yaml text
const config = configBuilder.getAsYaml();
```

### Methods

- `addPackageAccess(pattern: string, pkgAccess: PackageAccessYaml)`: Adds package access configuration.
- `addUplink(id: string, uplink: UpLinkConf)`: Adds an uplink configuration.
- `addSecurity(security: Partial<Security>)`: Adds security configuration.
- `addAuth(auth: Partial<AuthConf>)`: Adds authentication configuration.
- `addLogger(log: LoggerConfItem)`: Adds logger configuration.
- `addStorage(storage: string | object)`: Adds storage configuration.
- `getConfig(): ConfigYaml`: Retrieves the configuration object.
- `getAsYaml(): string`: Retrieves the configuration object as YAML format.

## `getDefaultConfig`

This method is available in the package's index and retrieves the default configuration object.

```typescript
import { getDefaultConfig } from '@verdaccio/config';

const defaultConfig = getDefaultConfig();
```

## Other Methods

- `fromJStoYAML(config: ConfigYaml): string`: Converts a JavaScript configuration object to YAML format.
- `parseConfigFile(filePath: string): ConfigYaml`: Parses a configuration file from the specified path and returns the configuration object.

### License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)

The Verdaccio documentation and logos (excluding /thanks, e.g., .md, .png, .sketch) files within the /assets folder) is
[Creative Commons licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE-docs).
