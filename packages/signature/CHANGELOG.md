# @verdaccio/signature

## 9.0.0-next-9.14

### Patch Changes

- @verdaccio/core@9.0.0-next-9.14
- @verdaccio/config@9.0.0-next-9.14

## 9.0.0-next-9.13

### Patch Changes

- Updated dependencies [39c369e]
  - @verdaccio/core@9.0.0-next-9.13
  - @verdaccio/config@9.0.0-next-9.13

## 9.0.0-next-9.12

### Patch Changes

- Updated dependencies [64c904a]
  - @verdaccio/config@9.0.0-next-9.12
  - @verdaccio/core@9.0.0-next-9.12

## 9.0.0-next-9.11

### Patch Changes

- Updated dependencies [96cb0c4]
  - @verdaccio/config@9.0.0-next-9.11
  - @verdaccio/core@9.0.0-next-9.11

## 9.0.0-next-9.10

### Patch Changes

- Updated dependencies [747d6ab]
  - @verdaccio/config@9.0.0-next-9.10
  - @verdaccio/core@9.0.0-next-9.10

## 9.0.0-next-9.9

### Patch Changes

- @verdaccio/core@9.0.0-next-9.9
- @verdaccio/config@9.0.0-next-9.9

## 9.0.0-next-9.8

### Patch Changes

- Updated dependencies [d68a86d]
  - @verdaccio/config@9.0.0-next-9.8
  - @verdaccio/core@9.0.0-next-9.8

## 9.0.0-next-9.7

### Major Changes

- f2e488d: feat!: remove deprecated AES encryption (aesEncryptDeprecated/aesDecryptDeprecated)

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

### Patch Changes

- Updated dependencies [f2e488d]
  - @verdaccio/config@9.0.0-next-9.7
  - @verdaccio/core@9.0.0-next-9.7

## 9.0.0-next-9.6

### Patch Changes

- Updated dependencies [1905990]
  - @verdaccio/core@9.0.0-next-9.6
  - @verdaccio/config@9.0.0-next-9.6

## 9.0.0-next-9.5

### Patch Changes

- fd09d4f: chore: update vitest to 4.1.0 and @vitest/coverage-v8 to 4.1.0
- Updated dependencies [8f9bcc8]
- Updated dependencies [a9d7b4a]
- Updated dependencies [1d5462f]
- Updated dependencies [fd09d4f]
  - @verdaccio/core@9.0.0-next-9.5
  - @verdaccio/config@9.0.0-next-9.5

## 9.0.0-next-9.4

### Major Changes

- 52a6520: Replace Babel and esbuild build pipeline with Vite 8 across all packages. All packages now output dual ESM (.mjs) and CJS (.js) formats with TypeScript declarations generated via vite-plugin-dts. Includes shared build config at vite.lib.config.mjs, proper exports field in all package.json files, and fixes for type-only re-exports required by Rollup's stricter module analysis.

### Patch Changes

- Updated dependencies [52a6520]
  - @verdaccio/config@9.0.0-next-9.4
  - @verdaccio/core@9.0.0-next-9.4

## 9.0.0-next-9.3

### Patch Changes

- Updated dependencies [66e7538]
  - @verdaccio/config@9.0.0-next-9.3
  - @verdaccio/core@9.0.0-next-9.3

## 9.0.0-next-9.2

### Patch Changes

- @verdaccio/core@9.0.0-next-9.2
- @verdaccio/config@9.0.0-next-9.2

## 9.0.0-next-9.1

### Patch Changes

- Updated dependencies [dd9bad3]
  - @verdaccio/core@9.0.0-next-9.1
  - @verdaccio/config@9.0.0-next-9.1

## 9.0.0-next-9.0

### Major Changes

- 7f80af5: chore: bump package

### Patch Changes

- Updated dependencies [7f80af5]
- Updated dependencies [34da6e6]
  - @verdaccio/config@9.0.0-next-9.0
  - @verdaccio/core@9.0.0-next-9.0

## 8.0.0-next-8.23

### Patch Changes

- Updated dependencies [b5eccfc]
  - @verdaccio/config@8.0.0-next-8.31
  - @verdaccio/core@8.0.0-next-8.31

## 8.0.0-next-8.22

### Patch Changes

- @verdaccio/core@8.0.0-next-8.30
- @verdaccio/config@8.0.0-next-8.30

## 8.0.0-next-8.21

### Patch Changes

- Updated dependencies [4edcae8]
- Updated dependencies [184632c]
  - @verdaccio/core@8.0.0-next-8.29
  - @verdaccio/config@8.0.0-next-8.29

## 8.0.0-next-8.20

### Patch Changes

- @verdaccio/core@8.0.0-next-8.28
- @verdaccio/config@8.0.0-next-8.28

## 8.0.0-next-8.19

### Patch Changes

- @verdaccio/config@8.0.0-next-8.27
- @verdaccio/core@8.0.0-next-8.27

## 8.0.0-next-8.18

### Patch Changes

- @verdaccio/config@8.0.0-next-8.26
- @verdaccio/core@8.0.0-next-8.26

## 8.0.0-next-8.17

### Patch Changes

- Updated dependencies [3aff890]
- Updated dependencies [b24f513]
  - @verdaccio/config@8.0.0-next-8.25
  - @verdaccio/core@8.0.0-next-8.25

## 8.0.0-next-8.16

### Patch Changes

- @verdaccio/core@8.0.0-next-8.24
- @verdaccio/config@8.0.0-next-8.24

## 8.0.0-next-8.15

### Patch Changes

- Updated dependencies [b671a38]
  - @verdaccio/config@8.0.0-next-8.23
  - @verdaccio/core@8.0.0-next-8.23

## 8.0.0-next-8.14

### Patch Changes

- Updated dependencies [67e667b]
- Updated dependencies [60ef8ff]
- Updated dependencies [05f03b3]
  - @verdaccio/core@8.0.0-next-8.22
  - @verdaccio/config@8.0.0-next-8.22

## 8.0.0-next-8.13

### Patch Changes

- Updated dependencies [f8a321f]
  - @verdaccio/core@8.0.0-next-8.21
  - @verdaccio/config@8.0.0-next-8.21

## 8.0.0-next-8.12

### Patch Changes

- Updated dependencies [08e1b21]
- Updated dependencies [a1a73e9]
- Updated dependencies [6a4d6dd]
  - @verdaccio/config@8.0.0-next-8.20
  - @verdaccio/core@8.0.0-next-8.20

## 8.0.0-next-8.11

### Patch Changes

- 4e14aff: chore(deps): signature, utils
- Updated dependencies [9350431]
  - @verdaccio/core@8.0.0-next-8.19
  - @verdaccio/config@8.0.0-next-8.19

## 8.0.0-next-8.10

### Patch Changes

- @verdaccio/core@8.0.0-next-8.18
- @verdaccio/config@8.0.0-next-8.18

## 8.0.0-next-8.9

### Patch Changes

- Updated dependencies [96d2f0f]
  - @verdaccio/core@8.0.0-next-8.17
  - @verdaccio/config@8.0.0-next-8.17

## 8.0.0-next-8.8

### Patch Changes

- 2fef671: chore(signature): remove duplicate code
- 3ef4a49: fix: support JWT sign and verify options
- Updated dependencies [72c3cbb]
- Updated dependencies [9509b63]
- Updated dependencies [626ae6a]
- Updated dependencies [2fef671]
- Updated dependencies [acb8a99]
- Updated dependencies [b19ddca]
  - @verdaccio/config@8.0.0-next-8.16
  - @verdaccio/core@8.0.0-next-8.16

## 8.0.0-next-8.7

### Patch Changes

- @verdaccio/config@8.0.0-next-8.15

## 8.0.0-next-8.6

### Patch Changes

- Updated dependencies [b9fea38]
- Updated dependencies [bb478f2]
  - @verdaccio/config@8.0.0-next-8.14

## 8.0.0-next-8.5

### Patch Changes

- e4a1539: chore: package.json maintenance
- Updated dependencies [b3fa5df]
- Updated dependencies [e4a1539]
- Updated dependencies [0607e80]
  - @verdaccio/config@8.0.0-next-8.13

## 8.0.0-next-8.4

### Patch Changes

- @verdaccio/config@8.0.0-next-8.12

## 8.0.0-next-8.3

### Patch Changes

- @verdaccio/config@8.0.0-next-8.11

## 8.0.0-next-8.2

### Patch Changes

- Updated dependencies [bf0e09a]
  - @verdaccio/config@8.0.0-next-8.10

## 8.0.0-next-8.1

### Minor Changes

- 6a8154c: feat: update logger pino to latest

## 8.0.0-next-8.0

### Major Changes

- chore: move v7 next to v8 next

## 7.0.0

### Major Changes

- 47f61c6: feat!: bump to v7
- e7ebccb: update major dependencies, remove old nodejs support

### Minor Changes

- daceb6d: restore legacy support
- b6d5652: support for createCipher backward compatible
- f047cc8: refactor: auth with legacy sign support
- bd8703e: feat: add migrateToSecureLegacySignature and remove enhancedLegacySignature property

### Patch Changes

- 312bc10: chore: export signature options type

## 7.0.0-next-7.5

### Minor Changes

- bd8703e: feat: add migrateToSecureLegacySignature and remove enhancedLegacySignature property

## 7.0.0-next-7.4

### Minor Changes

- b6d5652: support for createCipher backward compatible

## 7.0.0-next.3

### Minor Changes

- f047cc8: refactor: auth with legacy sign support

## 7.0.0-next.2

### Patch Changes

- 312bc100f: chore: export signature options type

## 7.0.0-next.1

### Major Changes

- e7ebccb61: update major dependencies, remove old nodejs support

### Minor Changes

- daceb6d87: restore legacy support

## 7.0.0-next.0

### Major Changes

- feat!: bump to v7

## 6.0.0

### Minor Changes

- ddb6a2239: feat: signature package
- dc571aabd: feat: add forceEnhancedLegacySignature

## 6.0.0-6-next.2

### Minor Changes

- ddb6a223: feat: signature package
- dc571aab: feat: add forceEnhancedLegacySignature
