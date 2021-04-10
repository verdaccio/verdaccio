---
'@verdaccio/api': minor
'verdaccio-htpasswd': minor
'@verdaccio/local-storage': minor
---

feat: remove level dependency by lowdb for npm token cli as storage

### new npm token database

There will be a new database located in your storage named `.token-db.json` which
will store all references to created tokens, **it does not store tokens**, just
mask of them and related metadata required to reference them.

#### Breaking change

If you were relying on `npm token` experiment. This PR will replace the
used database (level) by a json plain based one (lowbd) which does not
require Node.js C++ compilation step and has less dependencies. Since was
a experiment there is no migration step.
