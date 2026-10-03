---
'@verdaccio/local-storage': patch
'verdaccio-memory': patch
---

Fix API tokens for users whose name matches an `Object.prototype` key.

The token stores of `@verdaccio/local-storage` and `verdaccio-memory` indexed tokens by username in a plain object, so for users such as `constructor`, `toString` or `__proto__` they read the inherited property instead of the user's tokens. Creating, listing or revoking tokens (`npm token create/list/revoke`) failed with HTTP 500 for those users. The stores now keep tokens in a map without a prototype, and existing token databases need no migration.

These users can register with htpasswd since the registration fix in `verdaccio-htpasswd`, which made this failure reachable with the default configuration.
