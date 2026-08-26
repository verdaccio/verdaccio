---
'verdaccio': patch
---

Import shared helpers from `@verdaccio/core` and drop the deprecated `@verdaccio/utils` dependency

All internal usages of `@verdaccio/utils` now resolve the same helpers from
`@verdaccio/core` (validation, auth, crypto, package and author utilities), and
the `@verdaccio/utils` dependency has been removed.
