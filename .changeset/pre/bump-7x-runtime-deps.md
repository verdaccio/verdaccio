---
'verdaccio': patch
---

Updates the runtime dependencies `express` to 5.3.0 and `semver` to 7.8.5, and moves `body-parser` (used by Express to read request bodies) to 2.4.0.

`body-parser` 2.4.0 fixes a denial of service where trailing bytes after a compressed request body could keep the server busy (GHSA-27r3-jxmh-p828). Transitive dependencies with published advisories (`fast-uri`, `qs`, `ip-address`) are also moved to their patched releases. None of these change any API: no configuration or plugin changes are needed.

The rest of the changes in this release only affect the development toolchain and the test suite (`@cypress/request` is no longer used by the tests).
