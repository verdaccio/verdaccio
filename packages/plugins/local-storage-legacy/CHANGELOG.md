# Change Log

## 11.4.0

### Minor Changes

- 75e9dfa: feat: upgrade to TypeScript 7 and dual ESM/CommonJS builds

  - Upgrade the workspace compiler to TypeScript 7.0.2 (native compiler); type
    declarations are now emitted with `tsc --emitDeclarationOnly`.
  - Replace the Babel build pipeline with Vite (rolldown) library builds via a
    shared `vite.lib.config.mjs`; every package now ships both ESM (`.mjs`) and
    CommonJS (`.js`) outputs with `exports` maps in `package.json`.
  - Sources adjusted for ESM compatibility (`__dirname`/`require` shims,
    type-only re-exports, extension-full deep imports).
  - The plugin loader now supports ESM plugins: `require()` first, then a dynamic
    `import()` fallback with entry-point resolution for directory-based plugins
    (aligned with the loader on the main branch).
  - BREAKING: Node.js 22 is now the minimum supported version (`engines.node`
    `>=22` in every package).
  - BREAKING: the deprecated AES legacy signature
    (`aesEncryptDeprecated`/`aesDecryptDeprecated`/`generateRandomSecretKeyDeprecated`)
    has been removed from `@verdaccio/signature` and `@verdaccio/auth` — it relied
    on `crypto.createCipher`/`createDecipher`, which no longer exist in Node.js 22.
    The `security.api.migrateToSecureLegacySignature` startup migration
    (regenerating legacy 64-character secrets) is retained.

### Patch Changes

- Updated dependencies [75e9dfa]
  - @verdaccio/core@8.2.0
  - @verdaccio/file-locking@13.1.0
  - @verdaccio/streams@10.3.0

## 11.3.6

### Patch Changes

- 3724bd7: chore: trigger release
- Updated dependencies [3724bd7]
  - @verdaccio/core@8.1.4
  - @verdaccio/file-locking@13.0.3
  - @verdaccio/streams@10.2.7

## 11.3.5

### Patch Changes

- dc48942: chore: trigger release
- Updated dependencies [dc48942]
- Updated dependencies [3d2f75c]
  - @verdaccio/core@8.1.3
  - @verdaccio/file-locking@13.0.2
  - @verdaccio/streams@10.2.6

## 11.3.4

### Patch Changes

- Updated dependencies [589dd52]
  - @verdaccio/core@8.1.2
  - @verdaccio/file-locking@13.0.1

## 11.3.3

### Patch Changes

- f33d1d6: chore: trusted publisher release
- Updated dependencies [f33d1d6]
  - @verdaccio/core@8.1.1
  - @verdaccio/file-locking@13.0.1
  - @verdaccio/streams@10.2.5

## 11.3.2

### Patch Changes

- 5553b43: chore: migrate packages
- Updated dependencies [5553b43]
  - @verdaccio/streams@10.2.4

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
