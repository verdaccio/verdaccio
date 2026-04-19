# @verdaccio/plugin-verifier

## 1.0.0-next-9.10

### Patch Changes

- @verdaccio/core@9.0.0-next-9.14
- @verdaccio/loaders@9.0.0-next-9.14
- @verdaccio/logger@9.0.0-next-9.14

## 1.0.0-next-9.9

### Patch Changes

- Updated dependencies [39c369e]
  - @verdaccio/core@9.0.0-next-9.13
  - @verdaccio/loaders@9.0.0-next-9.13
  - @verdaccio/logger@9.0.0-next-9.13

## 1.0.0-next-9.8

### Patch Changes

- @verdaccio/loaders@9.0.0-next-9.12
- @verdaccio/core@9.0.0-next-9.12
- @verdaccio/logger@9.0.0-next-9.12

## 1.0.0-next-9.7

### Patch Changes

- @verdaccio/loaders@9.0.0-next-9.11
- @verdaccio/core@9.0.0-next-9.11
- @verdaccio/logger@9.0.0-next-9.11

## 1.0.0-next-9.6

### Patch Changes

- @verdaccio/loaders@9.0.0-next-9.10
- @verdaccio/core@9.0.0-next-9.10
- @verdaccio/logger@9.0.0-next-9.10

## 1.0.0-next-9.5

### Patch Changes

- @verdaccio/core@9.0.0-next-9.9
- @verdaccio/loaders@9.0.0-next-9.9
- @verdaccio/logger@9.0.0-next-9.9

## 1.0.0-next-9.4

### Patch Changes

- Updated dependencies [d68a86d]
  - @verdaccio/loaders@9.0.0-next-9.8
  - @verdaccio/core@9.0.0-next-9.8
  - @verdaccio/logger@9.0.0-next-9.8

## 1.0.0-next-9.3

### Patch Changes

- @verdaccio/loaders@9.0.0-next-9.7
- @verdaccio/core@9.0.0-next-9.7
- @verdaccio/logger@9.0.0-next-9.7

## 1.0.0-next-9.2

### Patch Changes

- 9d5360b: chore: vite replace rollupOptions with rolldownOptions
- Updated dependencies [1905990]
  - @verdaccio/core@9.0.0-next-9.6
  - @verdaccio/logger@9.0.0-next-9.6
  - @verdaccio/loaders@9.0.0-next-9.6

## 1.0.0-next-9.1

### Minor Changes

- a9d7b4a: feat: add @verdaccio/plugin-verifier tool package

  - feat(plugin-verifier): new package to verify that a Verdaccio plugin can be loaded, instantiated, and passes sanity checks — uses `asyncLoadPlugin` from `@verdaccio/loaders` (the same loader Verdaccio runs at startup)
  - feat(plugin-verifier): CLI built with clipanion (`verdaccio-plugin-verifier <plugin> --category <category>`)
  - feat(plugin-verifier): programmatic API for use in plugin test suites
  - feat(plugin-verifier): step-by-step diagnostics on failure (resolve, export, instantiate, sanity-check) with actionable error messages
  - feat(core): add shared sanity check functions (`authSanityCheck`, `storageSanityCheck`, `middlewareSanityCheck`, `filterSanityCheck`) to `pluginUtils` in `@verdaccio/core`
  - feat(loaders): add ESM plugin support — `tryLoadAsync` falls back from `require()` to dynamic `import()` when loading ESM plugins
  - refactor(auth,store,server): replace inline sanity check callbacks with shared functions from `@verdaccio/core`
  - fix(core): replace removed `pseudoRandomBytes` with `randomBytes` for Node.js 24 compatibility
  - fix(core): fix `process-warning` ESM interop — use default import instead of named imports for CJS compatibility

### Patch Changes

- Updated dependencies [4eda7ac]
- Updated dependencies [8f9bcc8]
- Updated dependencies [a9d7b4a]
- Updated dependencies [1d5462f]
- Updated dependencies [fd09d4f]
  - @verdaccio/logger@9.0.0-next-9.5
  - @verdaccio/core@9.0.0-next-9.5
  - @verdaccio/loaders@9.0.0-next-9.5
