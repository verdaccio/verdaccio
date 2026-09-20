---
name: plugins
description: Maintain the plugins bundled on the 8.x branch (htpasswd, local-storage-legacy, auth-memory, memory, audit, package-filter) and the frozen plugin contracts in @verdaccio/core that the verdaccio 6.x binary and third-party plugins depend on — fix a bundled plugin, diagnose why a plugin does not load, verify loading through @verdaccio/loaders and the e2e packages. Use when a task touches packages/plugins, packages/loaders, pluginUtils, or a plugin loading problem. New bundled plugins never land on this maintenance line.
---

# Plugins (8.x)

This branch ships the bundled plugins that the `verdaccio` 6.x binary runs and owns
the contracts every third-party plugin written for 6.x implements. The work here is
**maintenance only**: fixing the bundled plugins and keeping the contracts frozen.

## No new plugins on this line

A PR that adds a new bundled plugin under `packages/plugins` is declined on `8.x`:
new plugins, like new features, go through a discussion thread and land on `master`.
When asked to add one here, report that and point at
<https://github.com/verdaccio/verdaccio/discussions> (category _Ideas_). New
third-party plugins live in their own repositories; the website docs
(<https://verdaccio.org/docs/plugins>) describe the contracts.

## The bundled plugins

| Package                           | Path                                    | Category       | Notes                                                            |
| --------------------------------- | --------------------------------------- | -------------- | ---------------------------------------------------------------- |
| `verdaccio-htpasswd`              | `packages/plugins/htpasswd`             | authentication | Default auth of the 6.x binary                                   |
| `@verdaccio/local-storage-legacy` | `packages/plugins/local-storage-legacy` | storage        | The storage 6.x runs; callback-based API on `@verdaccio/streams` |
| `verdaccio-auth-memory`           | `packages/plugins/auth-memory`          | authentication | Reference for the auth chain; has an e2e package                 |
| `verdaccio-memory`                | `packages/plugins/memory`               | storage        | In-memory storage used by tests                                  |
| `verdaccio-audit`                 | `packages/plugins/audit`                | middleware     | `npm audit` proxy                                                |
| `@verdaccio/package-filter`       | `packages/plugins/package-filter`       | filter         | Registered under its scoped name in `filters:`                   |

The web UI (`@verdaccio/ui-theme`) is not on this branch; it is developed on `master`
and consumed by 6.x as a published `next-9` version.

## The contracts

The interfaces live in `packages/core/core/src/plugin-utils.ts` (`pluginUtils`), the
shared types in `@verdaccio/types`. Every plugin extends `pluginUtils.Plugin<Config>`
and is constructed as `(pluginConfig, { config, logger })`.

| Category       | Config section | Interface                                  | Sanity check (loader refuses the plugin without it)    |
| -------------- | -------------- | ------------------------------------------ | ------------------------------------------------------ |
| authentication | `auth:`        | `Auth<Config>`                             | one of `authenticate`, `allow_access`, `allow_publish` |
| storage        | `store:`       | `Storage<Config>` + `StorageHandler`       | `getPackageStorage`                                    |
| middleware     | `middlewares:` | `ExpressMiddleware<Config, Storage, Auth>` | `register_middlewares`                                 |
| filter         | `filters:`     | `ManifestFilter<Config>`                   | `filter_metadata`                                      |

**The contracts are frozen on this line.** Every third-party plugin written for
verdaccio 6 implements them, and 6.x consumes these packages as published versions.
Adding an optional method is the most a change may do, and only when 6.x needs it;
renaming, removing, changing a signature, or turning a callback into a promise is out
of scope here (it is a `master` change). The loader's sanity checks in
`plugin-utils.ts` are part of the contract too.

Semantics the bundled plugins rely on and that a fix must preserve:

- **Auth chain.** Plugins run in config order; `authenticate` answers `cb(null, groups)`
  on success, `cb(null, false)` to let the next plugin try, and a `VerdaccioError`
  (`errorUtils.getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD)`) to stop. The
  `allow_*` methods honour `$all`, `$anonymous`, `$authenticated`, and the user's
  groups exactly as `auth-memory` does; a change there alters package-access rules for
  every deployment.
- **Storage.** The 6.x binary drives the legacy callback-based storage API through
  `@verdaccio/local-storage-legacy` and `@verdaccio/streams`; keep both the callback
  shape and the promise-based `StorageHandler` in `pluginUtils` working. Writes are
  atomic and fail-safe; a failed tarball write leaves nothing behind. Only one storage
  plugin is used (the first loaded, with a warning).
- **Middleware.** `register_middlewares(app, auth, storage)` mounts routes on the
  Express app; protect them with `auth.apiJWTmiddleware()` rather than parsing tokens.
  `audit` is the default when `middlewares:` is empty.
- **Filter.** `filter_metadata(manifest)` returns a new manifest and runs on every
  packument read; `package-filter` shows the `versions`/`time`/`dist-tags`/`_distfiles`
  cleanup that must stay consistent.

## How plugins load

`asyncLoadPlugin` in `packages/loaders/src/plugin-async-loader.ts` is the loader,
used by `auth` here and by the 6.x binary for storage, filters and middleware:

- Key `foo` resolves to package `verdaccio-foo`;
  `server.pluginPrefix` replaces the prefix. A scoped key is used verbatim.
- With `plugins: ./plugins` in the config, `<plugins dir>/<package name>` is tried
  first (relative to the config file, so `configPath` must be set), then Node resolution
  from `node_modules`.
- The export is a `default` class (`new plugin.default(config, options)`) or a CJS
  factory function. `require()` is tried first, `import()` second; the entry point for a
  folder is read from `exports['.']`, then `module`, then `main`.
- A plugin that throws in its constructor, or fails the category's sanity check, is
  logged and skipped; the registry keeps starting.

Loader changes are tested in `packages/loaders/test` and through the e2e packages
(`pnpm test:e2e`, `packages/e2e/auth-memory` and `local-storage-legacy`); run both.

## Diagnosing "plugin not loaded"

There is no `@verdaccio/plugin-verifier` on this line; load the plugin the way the
registry does, with `asyncLoadPlugin` from `@verdaccio/loaders` and the category's
sanity check from `pluginUtils`, in a small script or a test. Then check, in order: the key-to-name mapping and
`pluginPrefix`, the `plugins:` folder versus `node_modules` resolution, the export
shape, a throwing constructor or a missing dependency of the plugin, and the sanity
check. The loader logs `package not found` for resolution problems, `error loading
plugin` for constructor and dependency errors, and `doesn't look like a valid plugin`
for a sanity failure; `DEBUG=verdaccio:plugin:* verdaccio` prints every step.

A "plugin not loaded" report from a user is usually one of these, not a loader bug;
triage it against this list before opening the loader.

## Fixing a bundled plugin

1. Reproduce with the plugin's own tests (`pnpm --filter <pkg> test`) or a config that
   registers it, started with `node packages/verdaccio/bin/verdaccio --config <yaml>`.
2. Fix in the plugin, not by special-casing it in `store`, `auth`, or `server`: a bundled
   plugin gets no privilege a third-party plugin cannot have.
3. Tests: unit tests instantiate the class with a config object and a fake logger
   (`new Config(getDefaultConfig())` from `@verdaccio/config` for the app config). Auth
   and storage changes run the e2e packages (`pnpm test:e2e`); anything the binary
   observes is checked through the 6.x Docker image built from the local packages
   (`pnpm verdaccio`) with the CLI battery of `verdaccio/e2e-tests`.
4. Rebuild the plugin before testing anything that consumes it (`build/` is what other
   packages import), then follow the [testing-changes](../testing-changes/SKILL.md)
   skill.
5. One changeset for the PR, naming the plugin package (patch). The fix reaches
   operators when the package is released (`chore: update versions 8.x`) and bumped on
   `6.x`; say so in the PR.
6. Port to `master` when the bug exists there; the plugin sources differ between lines,
   so re-run that line's tests rather than cherry-picking blindly.

Plugin configuration is not validated by core: a plugin validates its own section in
the constructor and fails there with a clear message, never on the first request, and
it does not read `process.env` for what belongs in the YAML. Never log credentials,
`debug` output included.
