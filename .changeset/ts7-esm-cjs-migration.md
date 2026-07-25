---
'@verdaccio/auth': minor
'@verdaccio/config': minor
'@verdaccio/core': minor
'@verdaccio/file-locking': minor
'@verdaccio/streams': minor
'@verdaccio/tarball': minor
'@verdaccio/url': minor
'@verdaccio/hooks': minor
'@verdaccio/loaders': minor
'@verdaccio/logger': minor
'@verdaccio/logger-commons': minor
'@verdaccio/logger-prettify': minor
'@verdaccio/middleware': minor
'verdaccio-audit': minor
'verdaccio-auth-memory': minor
'verdaccio-htpasswd': minor
'@verdaccio/local-storage-legacy': minor
'verdaccio-memory': minor
'@verdaccio/package-filter': minor
'@verdaccio/search-indexer': minor
'@verdaccio/signature': minor
'@verdaccio/test-helper': minor
'@verdaccio/utils': minor
---

feat: upgrade to TypeScript 7 and dual ESM/CommonJS builds

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
