---
'@verdaccio/signature': major
'@verdaccio/auth': major
'@verdaccio/config': major
'@verdaccio/types': major
---

feat!: remove deprecated AES encryption (aesEncryptDeprecated/aesDecryptDeprecated)

## Breaking Changes

### Removed deprecated AES encryption functions

The legacy `aesEncryptDeprecated` and `aesDecryptDeprecated` functions (based on the deprecated Node.js `createCipher`/`createDecipher` APIs) have been removed. All encryption now uses the modern `aesEncrypt`/`aesDecrypt` functions based on `aes-256-ctr` with `createCipheriv`/`createDecipheriv`.

**What changed:**

- `aesEncryptDeprecated`, `aesDecryptDeprecated`, and `generateRandomSecretKeyDeprecated` are no longer exported from `@verdaccio/signature`.
- The `packages/signature/src/legacy-signature` module has been deleted.
- `@verdaccio/auth` no longer falls back to deprecated encryption for secrets longer than 32 characters.
- `@verdaccio/config`: the `checkSecretKey()` method now **throws an error** if the secret is not exactly 32 characters long, instead of accepting longer keys with a deprecation warning.
- The `Config` constructor no longer accepts a `configOverrideOptions` parameter (`forceMigrateToSecureLegacySignature`).
- The `migrateToSecureLegacySignature` property has been removed from the `APITokenOptions` type and the default security configuration.
- The `isNodeVersionGreaterThan21()` helper has been removed from `@verdaccio/config`.

**Migration guide:**

If your `.verdaccio-db.json` contains a secret key that is not exactly 32 characters long, you must generate a new one. Delete the `secret` field from `.verdaccio-db.json` and Verdaccio will auto-generate a valid 32-character key on next startup. Note that existing tokens encrypted with the old deprecated method will no longer be decryptable — users will need to re-authenticate.
