---
'@verdaccio/config': patch
'@verdaccio/tarball': patch
'@verdaccio/url': patch
'@verdaccio/logger-prettify': patch
'@verdaccio/test-helper': patch
---

Update runtime dependencies to their latest minor and patch releases, with no change in behaviour for 6.x.

`@verdaccio/config` now uses `js-yaml` 5.5.0, `@verdaccio/tarball` uses `tar-stream` 3.2.2, `@verdaccio/url` uses `validator` 13.15.35 and `@verdaccio/logger-prettify` uses `dayjs` 1.11.23. `@verdaccio/test-helper` moves to `body-parser` 1.20.9, `fs-extra` 11.4.1 and `supertest` 7.3.1. No major versions were bumped. Operators do not need to do anything; the update arrives with the next `verdaccio` 6.x release.
