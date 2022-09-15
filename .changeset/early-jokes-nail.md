---
'@verdaccio/api': major
'@verdaccio/auth': major
'@verdaccio/config': major
'@verdaccio/types': major
'@verdaccio/loaders': major
'@verdaccio/node-api': major
'verdaccio-audit': major
'verdaccio-auth-memory': major
'verdaccio-htpasswd': major
'@verdaccio/local-storage': major
'verdaccio-memory': major
'@verdaccio/server': major
'@verdaccio/server-fastify': major
'@verdaccio/store': major
'@verdaccio/test-helper': major
'customprefix-auth': major
'verdaccio': major
'@verdaccio/web': major
---

feat(plugins): improve plugin loader

### Changes

- Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
- Avoid config collisions https://github.com/verdaccio/verdaccio/issues/928
- https://github.com/verdaccio/verdaccio/issues/1394
- `config.plugins` plugin path validations
- Updated algorithm for plugin loader.
- improved documentation (included dev)

## Features

- Add scope plugin support to 6.x https://github.com/verdaccio/verdaccio/pull/3227
- Custom prefix:

```
// config.yaml
server:
  pluginPrefix: mycompany
middleware:
  audit:
      foo: 1
```

This configuration will look up for `mycompany-audit` instead `Verdaccio-audit`.

## Breaking Changes

### plugin filter

- method rename `filter_metadata`->`filterMetadata`

### Plugin constructor does not merge configs anymore https://github.com/verdaccio/verdaccio/issues/928

The plugin receives as first argument `config`, which represents the config of the plugin. Example:

```
// config.yaml
auth:
  plugin:
     foo: 1
     bar: 2

export class Plugin<T> {
  public constructor(config: T, options: PluginOptions) {
    console.log(config);
    // {foo:1, bar: 2}
 }
}
```
