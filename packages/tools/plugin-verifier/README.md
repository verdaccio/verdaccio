# @verdaccio/plugin-verifier

A testing tool that verifies whether a Verdaccio plugin can be properly loaded, instantiated, and passes the required sanity checks for its category.

It uses `asyncLoadPlugin` from `@verdaccio/loaders` internally — the **same loader Verdaccio uses at startup** — so the verification is identical to what happens in production.

Available as both a **CLI** and a **programmatic API**.

This is a **pure ESM** package.

## Install

```bash
npm install --save-dev @verdaccio/plugin-verifier
```

## How It Works

When a plugin is verified, it runs through the same pipeline Verdaccio executes at boot time:

1. **Module resolution** — can the plugin be found via `require()`?
2. **Export validation** — does it export a function (CommonJS) or a class with a `default` export (ES6)?
3. **Instantiation** — can the plugin be constructed with a config and plugin options?
4. **Sanity check** — does the instance implement the required methods for its category?

### Required Methods by Category

| Category         | Required methods (at least one)                 |
| ---------------- | ----------------------------------------------- |
| `authentication` | `authenticate`, `allow_access`, `allow_publish` |
| `storage`        | `getPackageStorage`                             |
| `middleware`     | `register_middlewares`                          |
| `filter`         | `filter_metadata`                               |

## CLI

The CLI is built with [clipanion](https://mael.dev/clipanion/) (the same framework used by `@verdaccio/cli`).

### Usage

```bash
verdaccio-plugin-verifier <plugin> --category <category> [options]
```

### Options

| Option                 | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `--category, -c`       | **(required)** Plugin category: `authentication`, `storage`, `middleware`, `filter` |
| `--plugins-folder, -d` | Absolute path to the plugins directory (maps to `config.plugins`)                   |
| `--prefix, -p`         | Plugin name prefix (default: `verdaccio`)                                           |

### Examples

Verify an auth plugin from a local plugins folder:

```bash
verdaccio-plugin-verifier my-auth --category authentication --plugins-folder /path/to/plugins
```

Verify a storage plugin installed via npm:

```bash
verdaccio-plugin-verifier my-storage --category storage
```

Verify a scoped plugin:

```bash
verdaccio-plugin-verifier @myorg/my-plugin --category middleware
```

Use a custom plugin prefix:

```bash
verdaccio-plugin-verifier auth --category authentication --prefix mycompany
# resolves to "mycompany-auth"
```

### Exit Codes

| Code | Meaning                                                   |
| ---- | --------------------------------------------------------- |
| `0`  | Plugin loaded and passed all checks                       |
| `1`  | Plugin failed to load, instantiate, or pass sanity checks |

### CI Integration

Add a verification step to your plugin's CI pipeline:

```yaml
# GitHub Actions example
- name: Verify plugin
  run: npx verdaccio-plugin-verifier my-auth --category authentication --plugins-folder ./build
```

## Programmatic API

### Verify a file-based plugin

Use `pluginsFolder` to point to the directory containing your plugin. The plugin folder must be prefixed with `verdaccio-` (or your custom prefix), matching the convention Verdaccio uses to resolve plugins from a folder.

```
plugins/
  verdaccio-my-auth/
    index.js
    package.json
```

```typescript
import { PLUGIN_CATEGORY } from '@verdaccio/core';
import { verifyPlugin } from '@verdaccio/plugin-verifier';

const result = await verifyPlugin({
  pluginPath: 'my-auth',
  category: PLUGIN_CATEGORY.AUTHENTICATION,
  pluginsFolder: '/absolute/path/to/plugins',
});

if (result.success) {
  console.log(`Plugin loaded successfully (${result.pluginsLoaded} instance(s))`);
} else {
  console.error('Plugin verification failed:', result.error);
}
```

### Verify an npm-installed plugin

When `pluginsFolder` is omitted, the loader resolves the plugin from `node_modules` using Node's `require` algorithm, exactly as Verdaccio does in production.

```typescript
// Unscoped: looks for `verdaccio-my-auth` in node_modules
const result = await verifyPlugin({
  pluginPath: 'my-auth',
  category: PLUGIN_CATEGORY.AUTHENTICATION,
});

// Scoped: looks for `@myorg/my-auth` as-is
const result = await verifyPlugin({
  pluginPath: '@myorg/my-auth',
  category: PLUGIN_CATEGORY.AUTHENTICATION,
});
```

### Use in tests (vitest / jest)

This is the primary use case — add a test in your plugin repository to ensure it can be loaded by Verdaccio:

```typescript
import { describe, expect, it } from 'vitest';

import { PLUGIN_CATEGORY } from '@verdaccio/core';
import { verifyPlugin } from '@verdaccio/plugin-verifier';

describe('my verdaccio plugin', () => {
  it('should be loadable by verdaccio', async () => {
    const result = await verifyPlugin({
      pluginPath: 'my-auth',
      category: PLUGIN_CATEGORY.AUTHENTICATION,
      pluginsFolder: '/path/to/build/output',
    });

    expect(result.success).toBe(true);
    expect(result.pluginsLoaded).toBe(1);
  });
});
```

### Pass plugin configuration

If your plugin requires configuration to instantiate, pass it via `pluginConfig`:

```typescript
const result = await verifyPlugin({
  pluginPath: 'my-storage',
  category: PLUGIN_CATEGORY.STORAGE,
  pluginsFolder: '/path/to/plugins',
  pluginConfig: {
    dataDir: '/tmp/verdaccio-storage',
    maxSize: 1024,
  },
});
```

### Custom sanity check

Override the default sanity check to verify additional methods specific to your plugin:

```typescript
const result = await verifyPlugin({
  pluginPath: 'my-auth',
  category: PLUGIN_CATEGORY.AUTHENTICATION,
  pluginsFolder: '/path/to/plugins',
  sanityCheck: (plugin) => {
    return typeof plugin.authenticate === 'function' && typeof plugin.changePassword === 'function';
  },
});
```

### Custom plugin prefix

If your Verdaccio instance uses a custom plugin prefix (via `server.pluginPrefix` in `config.yaml`), pass it to the verifier:

```typescript
const result = await verifyPlugin({
  pluginPath: 'auth',
  category: PLUGIN_CATEGORY.AUTHENTICATION,
  pluginsFolder: '/path/to/plugins',
  prefix: 'mycompany', // looks for "mycompany-auth" instead of "verdaccio-auth"
});
```

## API Reference

### `verifyPlugin(options: VerifyPluginOptions): Promise<VerifyResult>`

#### `VerifyPluginOptions`

| Property        | Type                       | Default          | Description                                                                                               |
| --------------- | -------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `pluginPath`    | `string`                   | **(required)**   | Plugin identifier as it would appear in `config.yaml` (e.g. `my-auth`, `@scope/my-plugin`)                |
| `category`      | `PluginCategory`           | **(required)**   | Plugin category: `authentication`, `storage`, `middleware`, or `filter`                                   |
| `pluginConfig`  | `Record<string, unknown>`  | `{}`             | Configuration passed to the plugin constructor                                                            |
| `sanityCheck`   | `(plugin: any) => boolean` | _(per category)_ | Custom validation function; overrides the built-in check                                                  |
| `prefix`        | `string`                   | `'verdaccio'`    | Plugin name prefix (maps to `server.pluginPrefix`)                                                        |
| `pluginsFolder` | `string`                   | `undefined`      | Absolute path to plugins directory (maps to `config.plugins`); when omitted, resolves from `node_modules` |

#### `VerifyResult`

| Property        | Type             | Description                                     |
| --------------- | ---------------- | ----------------------------------------------- |
| `success`       | `boolean`        | Whether the plugin loaded and passed all checks |
| `pluginName`    | `string`         | The plugin identifier used                      |
| `category`      | `PluginCategory` | The category verified against                   |
| `pluginsLoaded` | `number`         | Number of plugin instances successfully loaded  |
| `error`         | `string?`        | Error message if verification failed            |

### Sanity Check Helpers

Individual sanity check functions are also exported for direct use:

```typescript
import {
  authSanityCheck,
  filterSanityCheck,
  getSanityCheck,
  // returns the right check for a given category
  middlewareSanityCheck,
  storageSanityCheck,
} from '@verdaccio/plugin-verifier';
```

## License

MIT
