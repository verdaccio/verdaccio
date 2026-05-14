# Change Log

## 11.3.1

### Patch Changes

- 5693d29: fix: typeError cjs vite
- Updated dependencies [5693d29]
  - @verdaccio/file-locking@10.3.3
  - @verdaccio/streams@10.2.3

## 11.3.0

### Minor Changes

- 46091db: Replace async library with native async/await, use globby for directory search, migrate types from legacy-types to @verdaccio/types, and add sanitize-filename for path traversal prevention

## 11.2.0

### Minor Changes

- 74de3b2: feat: add promise-based search API with optional remote uplink search
  - Added `searchAsync(query)` method returning `Promise<SearchItem[]>` for modern search consumers
  - Added `searchWithUplinks(query)` that merges local and remote registry results via `/-/v1/search`
  - Remote search is opt-in via `remoteSearch: true` plugin configuration
  - Legacy callback-based `search()` method remains unchanged for Verdaccio 6.x compatibility
  - Migrated all packages from Babel + Jest to Vite 8 + Vitest (CJS output)
  - Removed babel entirely from the monorepo

### Patch Changes

- Updated dependencies [74de3b2]
  - @verdaccio/file-locking@10.3.2
  - @verdaccio/streams@10.2.2

## 11.1.1

### Patch Changes

- b933033: fix: verdaccio core dependency
  - @verdaccio/file-locking@10.3.1
  - @verdaccio/streams@10.2.1

## 11.1.0

### Minor Changes

- 00b225b: feat: replace dependencies and add debug code

## 11.0.2

### Patch Changes

- d8a22b0: restore package

## 11.0.1

### Patch Changes

- 52f0a2d: feat!: rename package
