---
'@verdaccio/core': patch
'@verdaccio/tarball': patch
'@verdaccio/local-storage': patch
'@verdaccio/api': patch
'@verdaccio/middleware': patch
'@verdaccio/server': patch
'@verdaccio/web': patch
'@verdaccio/test-helper': patch
'verdaccio-audit': patch
---

Update the runtime dependencies of the core packages to their latest patch and minor releases: `sanitize-filename` 1.6.4, `process-warning` 5.1.1 and `tar-stream` 3.2.2, plus `express` 5.3.0 across every package that serves HTTP so the whole server runs on a single Express version.

No configuration or behaviour changes are expected; registry operators only need to upgrade.
