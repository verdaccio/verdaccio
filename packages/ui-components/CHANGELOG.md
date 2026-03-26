# @verdaccio/ui-components

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
