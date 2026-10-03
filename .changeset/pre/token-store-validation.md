---
'@verdaccio/local-storage': patch
'verdaccio-memory': patch
---

Improve validation of API token lookups in the `@verdaccio/local-storage` and `verdaccio-memory` token stores, which now consider only stored entries. Existing token databases need no migration.
