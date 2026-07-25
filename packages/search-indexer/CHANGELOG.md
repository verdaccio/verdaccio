# @verdaccio/search-indexer

## 8.1.0

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

## 8.0.4

### Patch Changes

- 3724bd7: chore: trigger release

## 8.0.3

### Patch Changes

- dc48942: chore: trigger release

## 8.0.2

### Patch Changes

- f33d1d6: chore: trusted publisher release

## 8.0.1

### Patch Changes

- 5553b43: chore: migrate packages

## 8.0.0

### Patch Changes

- 4296efb: fix: update dependencies

## 8.0.0-next-8.6

### Patch Changes

- 4296efb: fix: update dependencies

## 8.0.0-next-8.5

### Patch Changes

- 54b1906: chore(deps): node-api, proxy, search, search-indexer

## 8.0.0-next-8.4

### Patch Changes

- 8f28186: fix: add legacyMergeConfigs legacy plugins

## 8.0.0-next-8.3

### Patch Changes

- e4a1539: chore: package.json maintenance
- 0607e80: chore: update readme badges and license files

## 8.0.0-next-8.2

### Patch Changes

- e93d6a3: chore: auth package requires logger as parameter

## 8.0.0-next-8.1

### Minor Changes

- 6a8154c: feat: update logger pino to latest

## 8.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

## 7.0.0

### Patch Changes

- cce258e: refactor: search package
- 542f9d3: fix: remove node engine restriction

## 7.0.0-next-7.2

### Patch Changes

- 542f9d3: fix: remove node engine restriction

## 7.0.0-next-7.1

### Patch Changes

- cce258e: refactor: search package
