---
name: plugins
description: Maintain the plugins bundled in this repository (htpasswd, local-storage, auth-memory, memory, audit, package-filter, ui-theme) and the plugin contracts in @verdaccio/core — fix a bundled plugin, change a pluginUtils interface safely, diagnose why a plugin does not load, or verify a plugin with @verdaccio/plugin-verifier. Use when a task touches packages/plugins, packages/loaders, pluginUtils, or a plugin loading problem. Requests to add a new bundled plugin are gated on an accepted discussion thread; this skill says how to handle them.
---

# Plugins

This repository ships a small set of bundled plugins and owns the contracts every
third-party plugin implements. The work here is **maintenance**: fixing the bundled
plugins, keeping the contracts stable, and making sure plugins load. Writing a new
plugin is not repository work.

## New plugins are not accepted without a discussion first

A PR that adds a new bundled plugin under `packages/plugins` **is not accepted unless
an accepted discussion thread exists for it** in the repository's GitHub Discussions
(<https://github.com/verdaccio/verdaccio/discussions>, category _Ideas_). The
discussion settles whether the capability belongs in core, in a bundled plugin, or in
an external package, and who maintains it. When asked to add a bundled plugin:

- Look for the discussion and read the maintainers' conclusion. Without one, do not
  start the PR; report that the change needs a discussion thread first and what it
  should argue (the problem, why configuration and existing plugins do not cover it,
  the maintenance cost).
- With an accepted discussion, link it from the PR body and follow "Adding a bundled
  plugin" below.

New third-party plugins live in their own repositories, outside this one. Point
people to the website docs (<https://verdaccio.org/docs/plugins> and the `plugin-auth`,
`plugin-storage`, `plugin-middleware`, `plugin-filter`, `plugin-theme` pages); the
contracts below are the same, and `@verdaccio/plugin-verifier` checks the result. The
scaffolding tools for external plugins are not used in this repository.

## The bundled plugins

| Package                     | Path                              | Category       | Notes                                                                  |
| --------------------------- | --------------------------------- | -------------- | ---------------------------------------------------------------------- |
| `verdaccio-htpasswd`        | `packages/plugins/htpasswd`       | authentication | Default auth in `default.yaml`; file resolved relative to `configPath` |
| `@verdaccio/local-storage`  | `packages/plugins/local-storage`  | storage        | Default storage; the production reference for `StorageHandler`         |
| `verdaccio-auth-memory`     | `packages/plugins/auth-memory`    | authentication | Smallest complete auth plugin; the reference for the auth chain        |
| `verdaccio-memory`          | `packages/plugins/memory`         | storage        | In-memory storage used by tests; smallest complete storage plugin      |
| `verdaccio-audit`           | `packages/plugins/audit`          | middleware     | `npm audit` proxy; loaded by default when no middleware is configured  |
| `@verdaccio/package-filter` | `packages/plugins/package-filter` | filter         | Registered under its scoped name in `filters:`                         |
| `@verdaccio/ui-theme`       | `packages/plugins/ui-theme`       | theme          | The default web UI; consumed as a published dependency by every line   |

`packages/tools/verdaccio-*-fake-plugin` are test fixtures for the loader, not plugins
to maintain.

## The contracts

The interfaces live in `packages/core/core/src/plugin-utils.ts` (`pluginUtils`), the
shared types in `@verdaccio/types`. Every plugin extends `pluginUtils.Plugin<Config>`
and is constructed as `(pluginConfig, { config, logger })`.

| Category       | Config section | Interface                                             | Sanity check (loader refuses the plugin without it)    |
| -------------- | -------------- | ----------------------------------------------------- | ------------------------------------------------------ |
| authentication | `auth:`        | `Auth<Config>`                                        | one of `authenticate`, `allow_access`, `allow_publish` |
| storage        | `store:`       | `Storage<Config>` + `StorageHandler`                  | `getPackageStorage`                                    |
| middleware     | `middlewares:` | `ExpressMiddleware<Config, Storage, Auth>`            | `register_middlewares`                                 |
| filter         | `filters:`     | `ManifestFilter<Config>`                              | `filter_metadata`                                      |
| theme          | `theme:`       | object with `staticPath`, `manifest`, `manifestFiles` | all three properties                                   |

**Changing a contract is a breaking change for every third-party plugin.** Adding an
optional method (as `allow_stage` was added) is backwards compatible; renaming,
removing, changing a signature, or turning a callback into a promise is major: it needs
a major changeset, an entry in `docs/migrations-guide.md`, the bundled plugins updated
in the same PR, and a look at the external plugins the organisation maintains
(`verdaccio-aws-s3-storage`, `verdaccio-google-cloud`, `verdaccio-azure`,
`verdaccio-auth-ldap`, ...) so they can be ported. The loader's sanity checks in
`plugin-utils.ts` are part of the contract too.

Semantics the bundled plugins rely on and that a fix must preserve:

- **Auth chain.** Plugins run in config order; `authenticate` answers `cb(null, groups)`
  on success, `cb(null, false)` to let the next plugin try, and a `VerdaccioError`
  (`errorUtils.getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD)`) to stop. The
  `allow_*` methods honour `$all`, `$anonymous`, `$authenticated`, and the user's
  groups exactly as `auth-memory` does; a change there alters package-access rules for
  every deployment.
- **Storage.** `StorageHandler` is promise-based; `readTarball`/`writeTarball` return
  Node streams and receive an `AbortSignal`; writes are atomic and fail-safe;
  `updatePackage(name, async manifest => manifest)` serialises concurrent updates to
  the same manifest; a failed `writeTarball` leaves nothing behind. Only one storage
  plugin is used (the first loaded, with a warning).
- **Middleware.** `register_middlewares(app, auth, storage)` mounts routes on the
  Express app; protect them with `auth.apiJWTmiddleware()` rather than parsing tokens.
  `audit` is the default when `middlewares:` is empty.
- **Filter.** `filter_metadata(manifest)` returns a new manifest and runs on every
  packument read; `package-filter` shows the `versions`/`time`/`dist-tags`/`_distfiles`
  cleanup that must stay consistent.
- **Theme.** A factory returning `{ staticPath, manifest, manifestFiles: { js, css } }`;
  only the first theme is used.

## How plugins load

`asyncLoadPlugin` in `packages/loaders/src/plugin-async-loader.ts` is the only loader,
used by `auth`, `store` (storage and filters), `server/express` (middleware) and `web`
(theme), and by `@verdaccio/plugin-verifier`:

- Key `foo` resolves to package `verdaccio-foo` (`verdaccio-theme-foo` for themes);
  `server.pluginPrefix` replaces the prefix. A scoped key is used verbatim.
- With `plugins: ./plugins` in the config, `<plugins dir>/<package name>` is tried
  first (relative to the config file, so `configPath` must be set), then Node resolution
  from `node_modules`.
- The export is a `default` class (`new plugin.default(config, options)`) or a CJS
  factory function. `require()` is tried first, `import()` second; the entry point for a
  folder is read from `exports['.']`, then `module`, then `main`.
- A plugin that fails the category's sanity check is logged and skipped; the registry
  keeps starting. **A throwing constructor is only guaranteed to be caught this way
  when loaded from a configured `plugins:` folder** (that path wraps `executePlugin` in
  a `try`/`catch`); the npm-resolved (`node_modules`) path calls `executePlugin`
  unguarded, so a throwing constructor there currently propagates out of
  `asyncLoadPlugin` instead of being skipped — a known loader gap, not a guarantee.

Loader changes are tested in `packages/loaders/test` and through every bundled plugin's
`plugin-load.spec.ts`; run both.

## Diagnosing "plugin not loaded"

Run the verifier first: `verdaccio-plugin-verifier <key> --category <category>
[--plugins-folder <abs path>] [--prefix <prefix>]`, or `verifyPlugin({ pluginPath,
category, pluginsFolder, prefix, pluginConfig, configPath })` from
`@verdaccio/plugin-verifier`. Its diagnostics name the failing phase: resolve, export,
instantiate, or sanity-check. Then check, in order: the key-to-name mapping and
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
3. Tests: unit tests instantiate the class with a config object and a fake logger (see
   `packages/plugins/auth-memory/test/index.spec.ts`; `new Config(getDefaultConfig())`
   from `@verdaccio/config` for the app config), and every bundled plugin keeps a
   `plugin-load.spec.ts` through `verifyPlugin`. Auth and middleware changes get an
   integration test through `initializeServer` from `@verdaccio/test-helper`; storage
   changes run the `store` tests and the e2e CLI battery
   (`./scripts/e2e-cli-local.sh npm@11`).
4. Rebuild the plugin before testing anything that consumes it (`build/` is what other
   packages import), then follow the [testing-changes](../testing-changes/SKILL.md)
   skill.
5. One changeset for the PR, naming the plugin package (and `@verdaccio/core` when a
   contract moved).
   `htpasswd`, `audit`, and `package-filter` are dependencies of the `verdaccio` package
   and ship with every release; `ui-theme` is in the fixed version group.
6. Port to `6.x`/`8.x` when the bug exists there; the plugin sources differ between
   lines, so re-run that line's tests rather than cherry-picking blindly.

Plugin configuration is not validated by core: a plugin validates its own section in
the constructor and fails there with a clear message, never on the first request, and
it does not read `process.env` for what belongs in the YAML. Never log credentials,
`debug` output included.

## Adding a bundled plugin (only with an accepted discussion)

Mirror `packages/plugins/auth-memory`: `vite.config.mjs` calling `createLibConfig` from
the root `vite.lib.config.mjs`, `tsconfig.json` and `tsconfig.build.json` extending the
base, `package.json` with `build`/`watch`/`test`/`clean` scripts and `exports` pointing
at `build/`, `@verdaccio/core` as a `workspace:` dependency, a `types.ts` for the
plugin's config, a README with the config snippet. Then add the folder to
`pnpm-workspace.yaml`, `pnpm install`, build it, register it where the discussion
decided (`default.yaml`, `packages/verdaccio/package.json`), add the unit and
`plugin-load.spec.ts` tests, a `minor` changeset for the new package, and link the
discussion from the PR body.
