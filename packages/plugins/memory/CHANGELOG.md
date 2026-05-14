# Change Log

## 10.4.3

### Patch Changes

- 5693d29: fix: typeError cjs vite
- Updated dependencies [5693d29]
  - @verdaccio/streams@10.2.3

## 10.4.2

### Patch Changes

- 74de3b2: feat: add promise-based search API with optional remote uplink search
  - Added `searchAsync(query)` method returning `Promise<SearchItem[]>` for modern search consumers
  - Added `searchWithUplinks(query)` that merges local and remote registry results via `/-/v1/search`
  - Remote search is opt-in via `remoteSearch: true` plugin configuration
  - Legacy callback-based `search()` method remains unchanged for Verdaccio 6.x compatibility
  - Migrated all packages from Babel + Jest to Vite 8 + Vitest (CJS output)
  - Removed babel entirely from the monorepo

- Updated dependencies [74de3b2]
  - @verdaccio/streams@10.2.2

## 10.4.1

### Patch Changes

- b933033: fix: verdaccio core dependency
  - @verdaccio/streams@10.2.1

## 10.4.0

### Minor Changes

- 00b225b: feat: replace dependencies and add debug code

## 10.3.2

### Patch Changes

- 16972d2: fix: add missing types no functionality changes
- Updated dependencies [16972d2]
  - @verdaccio/streams@10.2.1

## 10.3.1

### Patch Changes

- 5769097: fix: update legacy types development

## 10.3.0

### Minor Changes

- b5cfaf6: feat: refactor types and typescript 4

### Patch Changes

- @verdaccio/streams@10.2.0

## 10.2.1

### Patch Changes

- 45fdb93: Fix storing tarballs with identical names from different packages in memory plugin

## 10.2.0

### Minor Changes

- 803c518: chore: update core dependencies

### Patch Changes

- Updated dependencies [803c518]
  - @verdaccio/commons-api@10.2.0
  - @verdaccio/streams@10.2.0

## 10.1.0

### Minor Changes

- 4e9a3d0: feat: remove core-js from bundle

  By using babel.js core-js injects some requires that are not necessarily dependencies and fails on pnpm and yarn 2 due are strict. No need to add this feature so is removed.
  - https://babeljs.io/docs/en/babel-preset-env#usebuiltins

### Patch Changes

- Updated dependencies [4e9a3d0]
  - @verdaccio/commons-api@10.1.0
  - @verdaccio/streams@10.1.0

## 10.0.2

### Patch Changes

- 6134415: fix: update dependencies
- Updated dependencies [6134415]
  - @verdaccio/commons-api@10.0.2
  - @verdaccio/streams@10.0.1

## 10.0.1

### Patch Changes

- Updated dependencies [22c38d5]
  - @verdaccio/commons-api@10.0.1

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [10.0.0](https://github.com/verdaccio/monorepo/compare/v9.7.5...v10.0.0) (2021-03-29)

**Note:** Version bump only for package verdaccio-memory

## [9.7.2](https://github.com/verdaccio/monorepo/compare/v9.7.1...v9.7.2) (2020-07-20)

**Note:** Version bump only for package verdaccio-memory

## [9.7.1](https://github.com/verdaccio/monorepo/compare/v9.7.0...v9.7.1) (2020-07-10)

**Note:** Version bump only for package verdaccio-memory

# [9.7.0](https://github.com/verdaccio/monorepo/compare/v9.6.1...v9.7.0) (2020-06-24)

**Note:** Version bump only for package verdaccio-memory

## [9.6.1](https://github.com/verdaccio/monorepo/compare/v9.6.0...v9.6.1) (2020-06-07)

### Bug Fixes

- **verdaccio-memory:** race condition on save a package ([#365](https://github.com/verdaccio/monorepo/issues/365)) ([70c1fb1](https://github.com/verdaccio/monorepo/commit/70c1fb1271e9e6af8577a81f8bf94d21d80e8d6b))

# [9.5.0](https://github.com/verdaccio/monorepo/compare/v9.4.1...v9.5.0) (2020-05-02)

**Note:** Version bump only for package verdaccio-memory

# [9.4.0](https://github.com/verdaccio/monorepo/compare/v9.3.4...v9.4.0) (2020-03-21)

**Note:** Version bump only for package verdaccio-memory

## [9.3.2](https://github.com/verdaccio/monorepo/compare/v9.3.1...v9.3.2) (2020-03-08)

**Note:** Version bump only for package verdaccio-memory

## [9.3.1](https://github.com/verdaccio/monorepo/compare/v9.3.0...v9.3.1) (2020-02-23)

**Note:** Version bump only for package verdaccio-memory

# [9.3.0](https://github.com/verdaccio/monorepo/compare/v9.2.0...v9.3.0) (2020-01-29)

**Note:** Version bump only for package verdaccio-memory

# [9.0.0](https://github.com/verdaccio/monorepo/compare/v8.5.3...v9.0.0) (2020-01-07)

**Note:** Version bump only for package verdaccio-memory

## [8.5.2](https://github.com/verdaccio/monorepo/compare/v8.5.1...v8.5.2) (2019-12-25)

### Bug Fixes

- add types for storage handler ([#307](https://github.com/verdaccio/monorepo/issues/307)) ([c35746e](https://github.com/verdaccio/monorepo/commit/c35746ebba071900db172608dedff66a7d27c23d))

## [8.5.1](https://github.com/verdaccio/monorepo/compare/v8.5.0...v8.5.1) (2019-12-24)

**Note:** Version bump only for package verdaccio-memory

# [8.5.0](https://github.com/verdaccio/monorepo/compare/v8.4.2...v8.5.0) (2019-12-22)

**Note:** Version bump only for package verdaccio-memory

## [8.4.2](https://github.com/verdaccio/monorepo/compare/v8.4.1...v8.4.2) (2019-11-23)

**Note:** Version bump only for package verdaccio-memory

## [8.4.1](https://github.com/verdaccio/monorepo/compare/v8.4.0...v8.4.1) (2019-11-22)

**Note:** Version bump only for package verdaccio-memory

# [8.4.0](https://github.com/verdaccio/monorepo/compare/v8.3.0...v8.4.0) (2019-11-22)

**Note:** Version bump only for package verdaccio-memory

# [8.3.0](https://github.com/verdaccio/monorepo/compare/v8.2.0...v8.3.0) (2019-10-27)

**Note:** Version bump only for package verdaccio-memory

# [8.2.0](https://github.com/verdaccio/monorepo/compare/v8.2.0-next.0...v8.2.0) (2019-10-23)

**Note:** Version bump only for package verdaccio-memory

# [8.2.0-next.0](https://github.com/verdaccio/monorepo/compare/v8.1.4...v8.2.0-next.0) (2019-10-08)

### Bug Fixes

- fixed lint errors ([5e677f7](https://github.com/verdaccio/monorepo/commit/5e677f7))
- fs.exists with other fileSystem alternatives ([#159](https://github.com/verdaccio/monorepo/issues/159)) ([f94e325](https://github.com/verdaccio/monorepo/commit/f94e325))

## [8.1.2](https://github.com/verdaccio/monorepo/compare/v8.1.1...v8.1.2) (2019-09-29)

**Note:** Version bump only for package verdaccio-memory

## [8.1.1](https://github.com/verdaccio/monorepo/compare/v8.1.0...v8.1.1) (2019-09-26)

**Note:** Version bump only for package verdaccio-memory

# [8.1.0](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.1...v8.1.0) (2019-09-07)

### Features

- **verdaccio-memory:** update @verdaccio/types and add new required methods ([eba5077](https://github.com/verdaccio/monorepo/commit/eba5077))

## [8.0.1-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.1-next.0...v8.0.1-next.1) (2019-08-29)

**Note:** Version bump only for package verdaccio-memory

## [8.0.1-next.0](https://github.com/verdaccio/monorepo/compare/v8.0.0...v8.0.1-next.0) (2019-08-29)

**Note:** Version bump only for package verdaccio-memory

# [8.0.0](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.4...v8.0.0) (2019-08-22)

**Note:** Version bump only for package verdaccio-memory

# [8.0.0-next.4](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.3...v8.0.0-next.4) (2019-08-18)

**Note:** Version bump only for package verdaccio-memory

# [8.0.0-next.2](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.1...v8.0.0-next.2) (2019-08-03)

**Note:** Version bump only for package verdaccio-memory

# [8.0.0-next.1](https://github.com/verdaccio/monorepo/compare/v8.0.0-next.0...v8.0.0-next.1) (2019-08-01)

**Note:** Version bump only for package verdaccio-memory

# [8.0.0-next.0](https://github.com/verdaccio/monorepo/compare/v2.0.0...v8.0.0-next.0) (2019-08-01)

### Bug Fixes

- issue on package not found ([944e1a5](https://github.com/verdaccio/monorepo/commit/944e1a5))
- missing params ([9979160](https://github.com/verdaccio/monorepo/commit/9979160))
- read tarball stream ([bc4bbbb](https://github.com/verdaccio/monorepo/commit/bc4bbbb))
- update new plugin types flow ([d2e2319](https://github.com/verdaccio/monorepo/commit/d2e2319))

### Features

- add getSecret support ([0d047f4](https://github.com/verdaccio/monorepo/commit/0d047f4))
- add limit feature ([9e2fa5c](https://github.com/verdaccio/monorepo/commit/9e2fa5c))
- drop node v6 ([d0ae9ba](https://github.com/verdaccio/monorepo/commit/d0ae9ba))
- local database method are async ([f55302b](https://github.com/verdaccio/monorepo/commit/f55302b))
- migrate to typescript ([c01df36](https://github.com/verdaccio/monorepo/commit/c01df36))
- node 6 as minimum ([ed81731](https://github.com/verdaccio/monorepo/commit/ed81731))
- update secret to async ([9bcab19](https://github.com/verdaccio/monorepo/commit/9bcab19))

# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [2.0.0](https://github.com/verdaccio/verdaccio-memory/compare/v2.0.0-beta.0...v2.0.0) (2019-03-29)

### Features

- drop node v6 ([227fe18](https://github.com/verdaccio/verdaccio-memory/commit/227fe18))

<a name="2.0.0-beta.0"></a>

# [2.0.0-beta.0](https://github.com/verdaccio/verdaccio-memory/compare/v1.0.3...v2.0.0-beta.0) (2019-01-27)

### Bug Fixes

- **deps:** update dependency http-errors to v1.7.0 ([0067759](https://github.com/verdaccio/verdaccio-memory/commit/0067759))

### Features

- migrate to typescript ([c7a8507](https://github.com/verdaccio/verdaccio-memory/commit/c7a8507))

<a name="1.0.3"></a>

## [1.0.3](https://github.com/verdaccio/verdaccio-memory/compare/v1.0.2...v1.0.3) (2018-07-15)

### Bug Fixes

- update new plugin types flow ([b0c5398](https://github.com/verdaccio/verdaccio-memory/commit/b0c5398))

<a name="1.0.2"></a>

## [1.0.2](https://github.com/verdaccio/verdaccio-memory/compare/v1.0.1...v1.0.2) (2018-07-15)
