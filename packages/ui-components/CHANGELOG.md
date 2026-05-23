# @verdaccio/ui-components

## 5.0.0-next-9.11

### Patch Changes

- 8793f4c: chore(ui-components): remove **partials** from build
- 5e64d64: chore(ui-components): update json-viewer
- 19471c8: chore(ui): pin vite and remove eslint plugin deps

## 5.0.0-next-9.10

### Patch Changes

- 446346b: fix: save auth token synchronously before navigation on login to ensure package list refreshes with authenticated access

  Disable SWR revalidateOnFocus and revalidateOnReconnect to prevent unnecessary repeated API calls

  Closes #5813

## 5.0.0-next-9.9

### Patch Changes

- e8292fb: fix(ui-components): search tests
- 2512f09: chore(ui-components): stderr during tests
- f19a638: chore: fix vite build warnings and errors

## 5.0.0-next-9.8

### Minor Changes

- 747d6ab: feat: auto-detect search response shape in the Web UI and remove the `searchRemote` flag

  ## Breaking Changes

  ### Removed the `searchRemote` feature flag

  The `flags.searchRemote` configuration option has been removed. The Web UI now
  auto-detects the shape of the `/-/verdaccio/data/search/*` response at render
  time, so no flag is required to toggle between local-only and remote-augmented
  results.

  **What changed:**

  - `FlagsConfig.searchRemote` has been removed from `@verdaccio/types`.
  - `@verdaccio/config` no longer reads or defaults `flags.searchRemote`.
  - The sample `# searchRemote: true` lines in `default.yaml` / `docker.yaml`
    have been removed.
  - The search UI (`@verdaccio/ui-components`) no longer consults the flag.

  **Migration guide:**

  Remove `flags.searchRemote` from your `config.yaml` if it is set. No other
  change is required — the Web UI will render both response shapes transparently.

  ## UI changes

  The `Search` component now consumes two response shapes without configuration:

  1. **npm-style "search objects"** — entries wrapped in a `package` envelope
     with `verdaccioPkgCached` / `verdaccioPrivate` metadata. Private / cached /
     remote chips are rendered as before.
  2. **Flat packument-style** — entries with `name`, `version`, `description`,
     `dist`, etc. at the top level. Chips are omitted because the shape carries
     no uplink metadata.

  A new `normalizeSearchOption()` helper centralizes the shape detection and is
  covered by unit tests. The `SearchResultWeb` type in `@verdaccio/types` is now
  a union (`SearchResultWebFlat | SearchResultWebWrapped`) that documents both
  shapes.

## 5.0.0-next-9.7

### Patch Changes

- d68a86d: refactor: migrate from lodash to lodash-es and replace simple utilities with native JS

## 5.0.0-next-9.6

### Patch Changes

- 70b30df: chore(ui-components): replace jsx with react.jsx

## 5.0.0-next-9.5

### Patch Changes

- aeb0ae6: chore(ui-components): simplify test server setup
- 80ddcda: chore(ui): remove babel dependency
- b4cac24: chore(ui-components): fix flaky tests, msw
- 9d5360b: chore: vite replace rollupOptions with rolldownOptions

## 5.0.0-next-9.4

### Patch Changes

- 8f9bcc8: fix: links to doc
- ed4c844: fix(ui-components): json viewer
- fd09d4f: chore: update vitest to 4.1.0 and @vitest/coverage-v8 to 4.1.0

## 5.0.0-next-9.3

### Major Changes

- 52a6520: Replace Babel and esbuild build pipeline with Vite 8 across all packages. All packages now output dual ESM (.mjs) and CJS (.js) formats with TypeScript declarations generated via vite-plugin-dts. Includes shared build config at vite.lib.config.mjs, proper exports field in all package.json files, and fixes for type-only re-exports required by Rollup's stricter module analysis.

### Patch Changes

- f32524b: fix: search component improvements

  - fix: extract search query from URL path instead of query params to match API routing
  - fix: decode URI components in search query (e.g. `%40` to `@`) for scoped packages
  - fix: resolve undefined package name on search result click when `searchRemote` is disabled
  - feat: display "No results found" message when search yields no matches
  - feat: make detail page tabs full-width on desktop and scrollable on mobile
  - test: add unit tests for AutoComplete component
  - test: update Search tests to cover debounce memoization and cleanup on unmount

- Updated dependencies [52a6520]
  - @verdaccio/ui-i18n@10.0.0-next-9.2

## 5.0.0-next-9.2

### Major Changes

- 325c584: feat: migrate to vite

### Patch Changes

- Updated dependencies [325c584]
  - @verdaccio/ui-i18n@10.0.0-next-9.1

## 5.0.0-next-9.1

### Major Changes

- dd9bad3: feat: upgrade to express v5

## 5.0.0-next-9.0

### Major Changes

- 7f80af5: chore: bump package

### Patch Changes

- Updated dependencies [7f80af5]
  - @verdaccio/ui-i18n@10.0.0-next-9.0

## 4.0.0-next-8.13

### Minor Changes

- b5eccfc: feat: remove rematch refactor ui

### Patch Changes

- Updated dependencies [b5eccfc]
  - @verdaccio/ui-i18n@8.0.0-next-8.14

## 4.0.0-next-8.12

### Patch Changes

- b24f513: chore(lint): switch rules from jest to vitest
- 6d1a84a: chore(deps): node-api, fastify, ui-comp, web
- 05c8e51: fix(ui): regression after mui 7 upgrade

## 4.0.0-next-8.11

### Patch Changes

- f443f81: chore(deps): sync and pin dependencies

## 4.0.0-next-8.10

### Patch Changes

- 07a0ecb: chore(ui): update deps and storybook

## 4.0.0-next-8.9

### Minor Changes

- 626ae6a: feat: web v1 login frontend (experimental)

### Patch Changes

- 387d9f0: fix(ui): check token expiry on refresh/timer
- 72c3cbb: chore(utils): replace @verdaccio/utils dependency with core
- 4236e54: chore(ui): avoid ts error for Alerts
- 89b72d0: fix(ui): search chips when showUplinks is false
- ca0844a: chore(ui): avoid ts errors for CircularProgress
- 6561485: chore(ui): fix ts error due to excluded test folder
- Updated dependencies [626ae6a]
  - @verdaccio/ui-i18n@8.0.0-next-8.13

## 4.0.0-next-8.8

### Patch Changes

- 2bcd3ca: chore(config): harmonize configuration options
- 209a650: chore: fix ui-component npmignore and readme

## 4.0.0-next-8.7

### Patch Changes

- ef6864c: chore(deps): update webpack-dev-server to v5
- 3763df1: fix(ui): start storybook on windows
- c81bd75: chore(ui): update react-json-view
- 99f6e11: chore(ui): flags import and minor updates
- e4a1539: chore: package.json maintenance
- 4933663: fix(ui): format date distance test
- 0607e80: chore: update readme badges and license files
- c1faf6d: chore(ui): reduce build size
- Updated dependencies [e4a1539]
- Updated dependencies [dbe6a76]
  - @verdaccio/ui-i18n@8.0.0-next-8.12

## 4.0.0-next-8.6

### Patch Changes

- Updated dependencies [b6e9f46]
  - @verdaccio/ui-i18n@8.0.0-next-8.11

## 4.0.0-next-8.5

### Minor Changes

- 970e0c9: update hover background color of package list

### Patch Changes

- 69f2e66: fix(ui): sort versions
- eb4a24b: chore(deps): upgrade storybook to v8
- 8289cc6: fix: ui-component vitest api

## 4.0.0-next-8.4

### Minor Changes

- 5a91448: support packages with multiple module types

## 4.0.0-next-8.3

### Patch Changes

- 0225c80: chore(ui): vitest follow-ups
