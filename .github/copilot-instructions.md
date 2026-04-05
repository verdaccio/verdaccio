# Verdaccio 6.x – Copilot Instructions

## Project Overview

Verdaccio is a lightweight private npm registry. This repo contains the main server package (v6.x), built with TypeScript and Express 4.

## Commands

```bash
# Install dependencies (always use yarn — never npm or pnpm)
yarn install

# Build (Babel transpiles TypeScript → JS into build/)
yarn build

# Run all tests (Vitest)
yarn test

# Run a single test file
yarn vitest run test/unit/modules/storage/store.spec.ts

# Type check
yarn lint:ts          # alias: yarn type-check

# Lint
yarn lint

# Format
yarn format
yarn format:check

# Dev server (TypeScript, with inspector)
yarn start

# Debug server via pre-built JS
yarn start:debug
```

**Package manager:** Yarn Berry 4.x with `node-modules` linker. Node.js 24 (minimum: 18).

## Architecture

The server is assembled in `src/api/index.ts` (`defineAPI`):

```
Request → Express middleware (cors, compression, logging)
        → Auth (@verdaccio/auth)
        → npm registry endpoints (src/api/endpoint/api/)
        → Web UI endpoints      (src/api/web/)
        → Debug endpoints       (src/api/debug/)
```

**Storage layer** (`src/lib/storage.ts → Storage`):

- `LocalStorage` (`src/lib/local-storage.ts`) — reads/writes packages on disk via `@verdaccio/local-storage-legacy`
- `ProxyStorage` (`src/lib/up-storage.ts`) — proxies requests to upstream npm registries (uplinks)
- `IPluginFilters` — optional chain of `ManifestFilter` plugins that transform package metadata before it is served; applied in `_applyFilters()` and enforced during tarball download via `_isTarballAllowedByFilters()`

**Plugin loading:** all plugins (auth, middleware, storage, filters) are loaded asynchronously via `@verdaccio/loaders`'s `asyncLoadPlugin`. Plugins are resolved using `serverSettings.pluginPrefix` (default: `"verdaccio"`).

**Entry points:**
- CLI: `bin/verdaccio` → `src/lib/cli/cli.ts` (Clipanion)
- Programmatic: `src/index.ts` exports `runServer` (preferred) and legacy `startVerdaccio`
- `runServer` (`src/lib/run-server.ts`) calls `endPointAPI` then `createServerFactory` for HTTP/HTTPS

**Key `@verdaccio/*` scoped packages (external, from monorepo):**
- `@verdaccio/auth` — authentication logic
- `@verdaccio/config` — config parsing, `ConfigBuilder`, `getDefaultConfig`
- `@verdaccio/core` — shared utils: `fileUtils`, `errorUtils`, `pkgUtils`, `PLUGIN_CATEGORY`
- `@verdaccio/loaders` — `asyncLoadPlugin`
- `@verdaccio/middleware` — Express helpers: `allow`, `errorReportingMiddleware`, `log`
- `@verdaccio/types` — shared TypeScript types (`Manifest`, `Config`, `RemoteUser`, etc.)

## Key Conventions

### TypeScript & Build
- Babel transpiles TypeScript (no `tsc` emit for JS — only `tsc --emitDeclarationOnly` for types).
- `tsconfig.json` targets `esnext` with `module: commonjs`. `strict: true`, `noImplicitAny: false`.
- Use `Manifest` (not the older `Package`) for package metadata types — `Package` is being phased out.

### Code Style
- Prettier: 100-char width, 2-space indent, single quotes.
- Import order enforced: `@verdaccio/*` packages first, then local imports (relative).
- ESLint flat config in `eslint.config.mjs`.
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, etc.

### Testing
- Framework: **Vitest** (migrating from Jest — both may coexist in older test files).
- Tests live in `test/unit/modules/**/*.spec.ts`.
- Test helpers in `test/helpers/` and `test/unit/partials/`.
- Use `test/unit/partials/config/index.ts` to build test configs: accepts an options object and optional YAML path, merges with `getDefaultConfig()`.
- Use `@verdaccio/core`'s `fileUtils.createTempStorageFolder()` (async) for temporary storage in tests; the sync helper in `test/helpers/utils.ts` is deprecated.
- Mock plugins for tests live under `test/unit/partials/plugin/` and `test/unit/modules/api/partials/plugin/`.
- Coverage thresholds: 70% lines, 75% functions, 60% branches.

### Express Types
- Use the local type aliases `$RequestExtend`, `$ResponseExtend`, `$NextFunctionVer` (from `src/types/`) instead of raw Express types inside `src/api/`.

### Error Handling
- Use `ErrorCode` helpers (`ErrorCode.getNotFound`, `ErrorCode.getUnauthorized`, etc.) from `src/lib/utils.ts`.
- HTTP status constants live in `src/lib/constants.ts` (`HTTP_STATUS`, `API_ERROR`, `HEADERS`, etc.).

### Filter Plugins
- A filter plugin must expose a `filter_metadata(manifest: Manifest): Promise<Manifest>` method.
- Filters are configured under the `filters` key in `config.yaml` and loaded by `Storage.init()`.
- Tarball downloads are gated by `_isTarballAllowedByFilters()` — if a version is filtered out, the tarball returns 404.
