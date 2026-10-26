# Changelog

## 7.0.2

### Patch Changes

- c017767: Remove the `HEALTHCHECK` from the Docker image.
  
  The probe used `localhost`, which resolves to `::1` on Alpine, while the image listens on IPv4 only by default. The container was always reported as `unhealthy` even though it served requests normally. The image no longer declares a health check, as in `6.x`.
  
  If you need one, add it yourself probing `127.0.0.1`, for example in `docker-compose.yaml`:
  
  ```yaml
  services:
    verdaccio:
      image: verdaccio/verdaccio
      healthcheck:
        test: ['CMD-SHELL', 'wget --quiet --tries=1 --spider http://127.0.0.1:4873/-/ping || exit 1']
        interval: 30s
        timeout: 5s
        start_period: 10s
        retries: 3
  ```
  
  See [Health check](https://verdaccio.org/docs/docker#healthcheck) in the Docker documentation for the `docker run` and HTTPS variants.

## 7.0.1

### Patch Changes

- 449ad6b: Restore the `@verdaccio/package-filter` plugin in the `verdaccio` 7 package so the filter configuration works again.
  
  Verdaccio 7.0.0 shipped a default `config.yaml` (also the one inside the `verdaccio/verdaccio:7` Docker image) with the `filters: '@verdaccio/package-filter'` section enabled, but the package no longer declared the plugin as a dependency: it was dropped when the 7.x line moved to the published `@verdaccio/*` modules. On startup the plugin loader logged `package not found, try to install @verdaccio/package-filter with a package manager` and continued without it, so any `minAgeDays`, `dateThreshold` or `block` rules configured under `filters` were silently not enforced.
  
  The plugin is a dependency of `verdaccio` again, as it is on the 6.x line, and the startup error is gone. No configuration change is needed; installations that worked around the problem by commenting out the `filters` section can enable it again. Affected: `verdaccio@7.0.0` and the `verdaccio/verdaccio:7` Docker image.
- 14aaded: Show the `verdaccio` package version in the web UI footer instead of the internal module version.
  
  `verdaccio@7.0.0` (and the `verdaccio/verdaccio:7` Docker image) displayed `9.0.0-next-9.40` in the bottom-right corner of the web UI. The 7 binary is a thin layer over the published `@verdaccio/*` 9.x modules, and `@verdaccio/server` filled the version shown by the UI from its own package while the command line and the startup log already reported the right one.
  
  This release updates the `@verdaccio/*` modules to `9.0.0-next-9.41`, whose `@verdaccio/server` lets the embedding binary set that value, and passes the `verdaccio` package version to it, so the UI now shows the same version as `verdaccio --version`. No configuration change is needed.

## 7.0.0

### Major Changes

- d33944c: **Verdaccio 7.0.0** is the first stable release of the 7.x line. It is published to npm as `latest` and to Docker Hub as `verdaccio/verdaccio:7`, `7.0` and `latest`; the 6.x line continues under the `latest-6` npm dist-tag and the `6` image tag. The release post is at https://verdaccio.org/blog/2026/10/25/verdaccio-7-release, the migration guide at https://verdaccio.org/blog/2026/09/27/verdaccio-6-to-7-migration, and the complete tracker with every pull request and backport at https://github.com/verdaccio/verdaccio/issues/5680.
  
  **Highlights**
  
  - **Staged publishing** (experimental, `flags.stage`, npm 11.17 or newer): a pipeline uploads a version, a maintainer reviews it, and only then it becomes installable ([#6176](https://github.com/verdaccio/verdaccio/pull/6176)). `GET /-/package/{name}/version/{version}/status` reports whether a version is `published` or `staged` ([#6365](https://github.com/verdaccio/verdaccio/pull/6365)).
  - **Two-factor authentication** (experimental, `flags.tfa`): time-based one-time passwords for login, account operations and publishing ([#6176](https://github.com/verdaccio/verdaccio/pull/6176)).
  - **Ownership and unpublish checks on every change**: `publish.check_owners` now covers `npm deprecate`, version unpublish and dist-tag changes ([#6219](https://github.com/verdaccio/verdaccio/pull/6219)); removing a version requires the unpublish permission on its own route ([#6384](https://github.com/verdaccio/verdaccio/pull/6384)); publish rejects invalid tarball attachment names before saving metadata and records an upload only after the tarball is fully written ([#6367](https://github.com/verdaccio/verdaccio/pull/6367)).
  - **Pure ESM plugins** through async plugin loading, and a **promise-based storage plugin API** with a compatibility adapter for callback-based storage plugins ([#5933](https://github.com/verdaccio/verdaccio/pull/5933)).
  - **Web UI**: dark mode, refreshed login, signup and password screens and SWR-based state ([#5563](https://github.com/verdaccio/verdaccio/pull/5563)); packages sorted by update time ([#5659](https://github.com/verdaccio/verdaccio/pull/5659)); `web.assetFolder` ([#5653](https://github.com/verdaccio/verdaccio/pull/5653)); home toolbar to filter, scope and sort, onboarding guide for empty registries, `web.footer`, `web.poweredBy` and `web.help`, package tabs in the URL and `bun` among the package managers ([#6400](https://github.com/verdaccio/verdaccio/pull/6400)); per-language translation progress with a single translation source ([#6395](https://github.com/verdaccio/verdaccio/pull/6395)); password changes from the account menu ([#6366](https://github.com/verdaccio/verdaccio/pull/6366)).
  - **Package filter plugins** with allow and block rules ([#5548](https://github.com/verdaccio/verdaccio/pull/5548)), glob patterns ([#5872](https://github.com/verdaccio/verdaccio/pull/5872)) and `excludeDeprecated` ([#6028](https://github.com/verdaccio/verdaccio/pull/6028)); notification hooks for publish and unpublish ([#5920](https://github.com/verdaccio/verdaccio/pull/5920)).
  - **Configuration**: `ConfigBuilder` covers web, listen, https, publish, flags, notify, middlewares, filters, maxBodySize, userRateLimit, urlPrefix and i18n ([#5805](https://github.com/verdaccio/verdaccio/pull/5805)); new `server.cors` ([#6255](https://github.com/verdaccio/verdaccio/pull/6255)), `server.dotfiles`, `server.hideStaticLogs`, `server.hidePingLogs` ([#6192](https://github.com/verdaccio/verdaccio/pull/6192)) and `server.legacyAuthCache` ([#6133](https://github.com/verdaccio/verdaccio/pull/6133)).
  - **Authentication**: htpasswd `verify_cache_ms` caches successful password verifications for clients that send credentials on every request ([#6351](https://github.com/verdaccio/verdaccio/pull/6351)); `npm login`, `yarn npm login` and `pnpm login` keep working through the Basic exception on the login routes ([#6354](https://github.com/verdaccio/verdaccio/pull/6354)).
  - **Uplinks and search**: `@verdaccio/proxy` on `got` ([#5646](https://github.com/verdaccio/verdaccio/pull/5646), [#5746](https://github.com/verdaccio/verdaccio/pull/5746)) with upstream errors mapped to registry errors ([#6022](https://github.com/verdaccio/verdaccio/pull/6022)); `/-/v1/search` with rate limits, bounded pagination and batched access checks, uplink results paginated before the client offset ([#6235](https://github.com/verdaccio/verdaccio/pull/6235)), configured uplink subpaths and headers preserved ([#6209](https://github.com/verdaccio/verdaccio/pull/6209)), ISO timestamps, version validation and original uplink errors preserved ([#6263](https://github.com/verdaccio/verdaccio/pull/6263), [#6264](https://github.com/verdaccio/verdaccio/pull/6264), [#6265](https://github.com/verdaccio/verdaccio/pull/6265)).
  - **Distribution**: the server composition and CLI helpers are exported for downstream distributions ([#5932](https://github.com/verdaccio/verdaccio/pull/5932), [#6286](https://github.com/verdaccio/verdaccio/pull/6286)), and the new experimental `@verdaccio/admin-cli` ships a `verdaccio-admin storage` command group ([#6231](https://github.com/verdaccio/verdaccio/pull/6231)).
  
  **Bug fixes**
  
  - Tarball downloads: uplink selection by URL, cleanup of failed downloads, no client hangs and a correct `content-length` ([#6194](https://github.com/verdaccio/verdaccio/pull/6194), [#6234](https://github.com/verdaccio/verdaccio/pull/6234)); client-controlled `dist.tarball` URLs are not fetched off-uplink ([#6225](https://github.com/verdaccio/verdaccio/pull/6225)); the uplink cache is refreshed on `304` ([#6276](https://github.com/verdaccio/verdaccio/pull/6276)).
  - Package access, publish and unpublish rules match case-insensitively ([#6091](https://github.com/verdaccio/verdaccio/pull/6091)); package and token name validation aligned with npm ([#6309](https://github.com/verdaccio/verdaccio/pull/6309), [#6314](https://github.com/verdaccio/verdaccio/pull/6314)); search validation ([#6306](https://github.com/verdaccio/verdaccio/pull/6306), [#6317](https://github.com/verdaccio/verdaccio/pull/6317)); missing versions, dist-tags and packages return not found ([#6332](https://github.com/verdaccio/verdaccio/pull/6332)); `401` for invalid credentials on `GET /-/user/` ([#5844](https://github.com/verdaccio/verdaccio/pull/5844)); local storage no longer uses uncontrolled data in paths ([#5847](https://github.com/verdaccio/verdaccio/pull/5847)); the home directory resolves through `HOME` on Windows ([#6247](https://github.com/verdaccio/verdaccio/pull/6247)); missing `Host` header handled ([#5641](https://github.com/verdaccio/verdaccio/pull/5641)).
  - Web: scope validation on the web package endpoints ([#6202](https://github.com/verdaccio/verdaccio/pull/6202)), search component fixes ([#5647](https://github.com/verdaccio/verdaccio/pull/5647)), signup, error states, i18n and routing ([#6210](https://github.com/verdaccio/verdaccio/pull/6210), [#6213](https://github.com/verdaccio/verdaccio/pull/6213)), password change validation ([#6326](https://github.com/verdaccio/verdaccio/pull/6326)), English fallback for untranslated strings ([#6406](https://github.com/verdaccio/verdaccio/pull/6406)), JSON viewer ([#5651](https://github.com/verdaccio/verdaccio/pull/5651)).
  - Logger: JSON sync output honoured, unused pretty destinations removed and file destination errors handled ([#6242](https://github.com/verdaccio/verdaccio/pull/6242), [#6260](https://github.com/verdaccio/verdaccio/pull/6260)).
  
  **Breaking changes**
  
  - **Node.js 24** or newer is required ([#5615](https://github.com/verdaccio/verdaccio/pull/5615)).
  - **Express 5** ([#5524](https://github.com/verdaccio/verdaccio/pull/5524)): middleware plugins must use named wildcards (`/*splat`, `/{*splat}`), `res.sendFile(filename, { root })` for absolute paths, and `req.body` is already parsed when plugins run.
  - **YAML configuration only** ([#5851](https://github.com/verdaccio/verdaccio/pull/5851)); `config.self_path` was replaced by `config.configPath` ([#5850](https://github.com/verdaccio/verdaccio/pull/5850)).
  - **Bearer tokens for the package API** ([#6152](https://github.com/verdaccio/verdaccio/pull/6152)): `_auth` entries in `.npmrc` must move to `_authToken`; `401` responses advertise only `Bearer`. The login routes accept Basic credentials while `security.api.basicLogin` is enabled (the default).
  - **Removed**: the `/-/all` search endpoint (use `/-/v1/search`), `npm star`/`unstar` ([#5930](https://github.com/verdaccio/verdaccio/pull/5930)), the deprecated AES encryption helpers ([#5744](https://github.com/verdaccio/verdaccio/pull/5744)), the `searchRemote` flag ([#5801](https://github.com/verdaccio/verdaccio/pull/5801)) and the debug-only `PUT /:package/:version/-tag/:tag` route.
  - **Programmatic API** ([#5808](https://github.com/verdaccio/verdaccio/pull/5808)): the default export is the asynchronous `runServer`, which no longer accepts `{ listenArg }`; `await runServer(config)` then call `.listen()`. Import `Config`, `ConfigBuilder`, `getDefaultConfig` and `parseConfigFile` from `@verdaccio/core`.
  - **Logger**: `@verdaccio/logger-commons` and `@verdaccio/logger-prettify` are merged into `@verdaccio/logger` ([#5657](https://github.com/verdaccio/verdaccio/pull/5657)).
  - **Build**: dual ESM/CJS output built with Vite ([#5643](https://github.com/verdaccio/verdaccio/pull/5643)); package `exports` changed, so update deep imports.
  - **Relocated plugins**: `verdaccio-aws-s3-storage`, `verdaccio-google-cloud` and `verdaccio-active-directory` moved to their own repositories.
  - A server secret shorter than 32 characters stops the server, and `.sinopia-db.json` databases are no longer read.
  
  **Also in 6.x**
  
  Dual ESM/CJS output, the package filter plugin, publish and unpublish notifications, the bounded `/-/v1/search`, the `@verdaccio/e2e-cli` workflow, the shared `@verdaccio/ui-theme` Web UI, the htpasswd, name and search validation fixes and the new Web UI home were also backported to 6.x; the tracker lists the 6.x release that carries each one.
  
  **Tooling and dependencies**
  
  pnpm 12 replaces Yarn for the workspace and CI ([#5748](https://github.com/verdaccio/verdaccio/pull/5748), [#6216](https://github.com/verdaccio/verdaccio/pull/6216)); CI runs on Windows ([#6248](https://github.com/verdaccio/verdaccio/pull/6248)); end-to-end tests run through `@verdaccio/e2e-cli` ([#5678](https://github.com/verdaccio/verdaccio/pull/5678)); the repository carries `AGENTS.md` and agent skills ([#6252](https://github.com/verdaccio/verdaccio/pull/6252)). Runtime dependencies move to Express 5.3, `got` 15, `js-yaml` 5, TypeScript 7 and Vite 8, with the published advisories in `body-parser`, `proxy-addr`, `compression`, `lodash-es`, `dompurify` and `fast-uri` patched ([#6334](https://github.com/verdaccio/verdaccio/pull/6334), [#6388](https://github.com/verdaccio/verdaccio/pull/6388)).
  
  **Upgrading**
  
  Back up the configuration, storage and `.verdaccio-db.json`, update the runtime to Node.js 24, convert any JSON or JS configuration to YAML and test with a copy of the storage before switching. Do not run 6.x and 7.x against the same storage at the same time.
  
  **Thanks** to @juanpicado, @mbtools, @dianmorales, @jotadeveloper, @davidus27, @koliveira15, @moglerdev, @pranshuchittora, @ReemX, @RuneStone0, @tmota900 and @vsugrob for the work in this release line.

### Minor Changes

- ddf993c: Adopt `@verdaccio/server` and drop the local api/web/storage forks. A thin `Storage` wrapper is kept to support legacy callback-based storage plugins, and the unused helpers in `src/lib/utils.ts` were removed.

### Patch Changes

- e404c82: Updates the runtime dependencies `express` to 5.3.0 and `semver` to 7.8.5, and moves `body-parser` (used by Express to read request bodies) to 2.4.0.
  
  `body-parser` 2.4.0 fixes a denial of service where trailing bytes after a compressed request body could keep the server busy (GHSA-27r3-jxmh-p828). Transitive dependencies with published advisories (`fast-uri`, `qs`, `ip-address`) are also moved to their patched releases. None of these change any API: no configuration or plugin changes are needed.
  
  The rest of the changes in this release only affect the development toolchain and the test suite (`@cypress/request` is no longer used by the tests).
- a307098: Migrate the 7.x release workflow to Changesets action v2 and CLI v3.
- 256fd40: Disable dependency lifecycle scripts and require third-party dependencies to be at least three days old when installing Verdaccio in the final Docker image stage.
  
  The production installation now uses npm's `--ignore-scripts` and `--min-release-age=3` options. Verdaccio and packages matching `@verdaccio/*` or `verdaccio-*` are excluded from the age restriction so new Verdaccio releases can be built immediately. The final stage updates npm to support these exclusions and disables installation audit and funding output. Image builds still fail if another required dependency has no eligible version. No configuration changes are required for operators.
  
  The Docker base image uses Node.js 24.15.0 for compatibility with the updated npm.
- f565393: Update the proxy address dependency to correctly match trusted proxy subnets when determining client IP addresses. Earlier 7.x prereleases using the affected dependency can misidentify clients with certain IPv6 trust configurations. No configuration migration is required.
  
  Update `@verdaccio/e2e-cli` to 4.0.0, which drops pnpm 10, and remove pnpm 10 from the CLI e2e matrix.
- 6fd3e8a: Make `/-/v1/search` work for storage plugins that still use the callback API.
  
  Verdaccio 7 keeps callback-based storage plugins running through a compatibility
  adapter. Its `search` collected whatever the plugin streamed and handed the list
  straight back, with two consequences for every such plugin.
  
  The search query was dropped before it reached the plugin, and the adapter passed a
  name predicate that always returned true, so the plugin emitted its whole catalogue and
  nothing ever filtered it. `/-/v1/search` answered with every package in the registry
  regardless of the text searched for, and paginated over that full list. It failed
  silently: the endpoint returned 200 and the npm client still found what it asked for,
  buried among everything else.
  
  The adapter also passed the items through unchanged. The legacy contract emits the
  package itself, while the store reads `item.package.name`, so a plugin following the
  documented contract made the endpoint fail with a 500 instead.
  
  The adapter now filters the collected results by the query text and wraps anything that
  is not already in the store's shape. The filtering is done on the emitted name, never on
  the name predicate a plugin is given: that one receives the basename, so rejecting there
  would drop scoped packages whose full name does match. Operators running a callback-based
  storage plugin get working search without touching the plugin; plugins already on the
  promise-based API were never wrapped and are unaffected.
- f1f5d34: chore: trigger release
- a768d16: chore: replace eslint and prettier with oxlint and oxfmt
- 594f438: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.
- 88bd996: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.
- 908ccbb: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.
- e862a9a: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.
- 1aef95b: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.
- 304f155: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.
- c461320: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.
- a4ced54: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.32

### Patch Changes

- e404c82: Updates the runtime dependencies `express` to 5.3.0 and `semver` to 7.8.5, and moves `body-parser` (used by Express to read request bodies) to 2.4.0.
  
  `body-parser` 2.4.0 fixes a denial of service where trailing bytes after a compressed request body could keep the server busy (GHSA-27r3-jxmh-p828). Transitive dependencies with published advisories (`fast-uri`, `qs`, `ip-address`) are also moved to their patched releases. None of these change any API: no configuration or plugin changes are needed.
  
  The rest of the changes in this release only affect the development toolchain and the test suite (`@cypress/request` is no longer used by the tests).
- 304f155: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.31

### Patch Changes

- 256fd40: Disable dependency lifecycle scripts and require third-party dependencies to be at least three days old when installing Verdaccio in the final Docker image stage.
  
  The production installation now uses npm's `--ignore-scripts` and `--min-release-age=3` options. Verdaccio and packages matching `@verdaccio/*` or `verdaccio-*` are excluded from the age restriction so new Verdaccio releases can be built immediately. The final stage updates npm to support these exclusions and disables installation audit and funding output. Image builds still fail if another required dependency has no eligible version. No configuration changes are required for operators.
  
  The Docker base image uses Node.js 24.15.0 for compatibility with the updated npm.
- f565393: Update the proxy address dependency to correctly match trusted proxy subnets when determining client IP addresses. Earlier 7.x prereleases using the affected dependency can misidentify clients with certain IPv6 trust configurations. No configuration migration is required.
  
  Update `@verdaccio/e2e-cli` to 4.0.0, which drops pnpm 10, and remove pnpm 10 from the CLI e2e matrix.
- 1aef95b: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.30

### Patch Changes

- a307098: Migrate the 7.x release workflow to Changesets action v2 and CLI v3.
- e862a9a: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.29

### Patch Changes

- 908ccbb: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.28

### Patch Changes

- 6fd3e8a: Make `/-/v1/search` work for storage plugins that still use the callback API.

  Verdaccio 7 keeps callback-based storage plugins running through a compatibility
  adapter. Its `search` collected whatever the plugin streamed and handed the list
  straight back, with two consequences for every such plugin.

  The search query was dropped before it reached the plugin, and the adapter passed a
  name predicate that always returned true, so the plugin emitted its whole catalogue and
  nothing ever filtered it. `/-/v1/search` answered with every package in the registry
  regardless of the text searched for, and paginated over that full list. It failed
  silently: the endpoint returned 200 and the npm client still found what it asked for,
  buried among everything else.

  The adapter also passed the items through unchanged. The legacy contract emits the
  package itself, while the store reads `item.package.name`, so a plugin following the
  documented contract made the endpoint fail with a 500 instead.

  The adapter now filters the collected results by the query text and wraps anything that
  is not already in the store's shape. The filtering is done on the emitted name, never on
  the name predicate a plugin is given: that one receives the basename, so rejecting there
  would drop scoped packages whose full name does match. Operators running a callback-based
  storage plugin get working search without touching the plugin; plugins already on the
  promise-based API were never wrapped and are unaffected.

## 7.0.0-next-7.27

### Patch Changes

- 88bd996: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.26

### Patch Changes

- 594f438: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.25

### Patch Changes

- c461320: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.24

### Patch Changes

- f1f5d34: chore: trigger release

## 7.0.0-next-7.23

### Patch Changes

- a768d16: chore: replace eslint and prettier with oxlint and oxfmt

## 7.0.0-next-7.22

### Patch Changes

- a4ced54: Update verdaccio dependencies (`@verdaccio/*`, `verdaccio`, `verdaccio-*`) to the `next-9` npm dist-tag.

## 7.0.0-next-7.21

### Minor Changes

- ddf993c: Adopt `@verdaccio/server` and drop the local api/web/storage forks. A thin `Storage` wrapper is kept to support legacy callback-based storage plugins, and the unused helpers in `src/lib/utils.ts` were removed.

## 7.0.0-beta.7

### Minor Changes

- ddf993c: Adopt `@verdaccio/server` and drop the local api/web/storage forks. A thin `Storage` wrapper is kept to support legacy callback-based storage plugins, and the unused helpers in `src/lib/utils.ts` were removed.

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [7.0.0-beta.6](https://github.com/verdaccio/verdaccio/compare/v7.0.0-beta.5...v7.0.0-beta.6) (2026-03-29)

## [7.0.0-beta.5](https://github.com/verdaccio/verdaccio/compare/v7.0.0-beta.4...v7.0.0-beta.5) (2026-03-29)

### Features

- migrate to pnpm and vite ([#5748](https://github.com/verdaccio/verdaccio/issues/5748)) ([379b622](https://github.com/verdaccio/verdaccio/commit/379b622764e1d6a0edbf41f8af9f1d108af547b0))
- migrate to verdaccio/proxy ([#5646](https://github.com/verdaccio/verdaccio/issues/5646)) ([a1fd32d](https://github.com/verdaccio/verdaccio/commit/a1fd32d807645a54e11d81b81a73c52823aaabf1))

### Bug Fixes

- **deps:** update core verdaccio dependencies (7.x) ([#5742](https://github.com/verdaccio/verdaccio/issues/5742)) ([a825f95](https://github.com/verdaccio/verdaccio/commit/a825f95604efbfe732ab33df9b205426bd802acf))
- **deps:** update dependency lru-cache to v11 (7.x) ([#5624](https://github.com/verdaccio/verdaccio/issues/5624)) ([1e9bdc8](https://github.com/verdaccio/verdaccio/commit/1e9bdc895c81acb229ad5a76256be004b95da1ba))
- **deps:** update dependency mime to v4 (7.x) ([#5625](https://github.com/verdaccio/verdaccio/issues/5625)) ([a480708](https://github.com/verdaccio/verdaccio/commit/a480708a3b6729cabc2599b713d95bbb2681b0e5))

## [7.0.0-beta.4](https://github.com/verdaccio/verdaccio/compare/v7.0.0-beta.3...v7.0.0-beta.4) (2026-03-10)

### Bug Fixes

- **deps:** update dependency express to v5 (7.x) ([#5622](https://github.com/verdaccio/verdaccio/issues/5622)) ([9563f50](https://github.com/verdaccio/verdaccio/commit/9563f501af5b83a3f5adb9f2d68deb6508df89d0))

## [7.0.0-beta.3](https://github.com/verdaccio/verdaccio/compare/v7.0.0-beta.2...v7.0.0-beta.3) (2026-03-08)

### Features

- add dual ESM and CJS build output ([ff457b8](https://github.com/verdaccio/verdaccio/commit/ff457b8f9c41014c7db375a3dca2f961e63b8658))
- improve Dockerfile layer caching, reduce image size, and add healthcheck ([6f4e96b](https://github.com/verdaccio/verdaccio/commit/6f4e96bb7bb847bdaeaa65b4bbb50a7304216573))

### Bug Fixes

- **deps:** update dependency @verdaccio/ui-theme to v8.0.0-next-8.31 ([7be0081](https://github.com/verdaccio/verdaccio/commit/7be00818894d988d20bf7172c1b627319db527e6))

## [7.0.0-beta.2](https://github.com/verdaccio/verdaccio/compare/v6.3.0...v7.0.0-beta.2) (2026-03-08)

## [7.0.0-beta.1](https://github.com/verdaccio/verdaccio/compare/v6.3.0...v7.0.0-beta.1) (2026-03-08)

## [7.0.0-beta.0](https://github.com/verdaccio/verdaccio/compare/v6.3.0...v7.0.0-beta.0) (2026-03-08)
