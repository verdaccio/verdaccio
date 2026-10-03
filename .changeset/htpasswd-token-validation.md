---
'verdaccio-htpasswd': patch
'@verdaccio/auth': patch
'verdaccio-auth-memory': patch
'@verdaccio/local-storage-legacy': patch
---

Improve validation of user registration, authentication and API tokens.

User and token lookups in the htpasswd, in-memory auth and legacy token stores now consider only stored entries. When htpasswd reloads its file, users removed from it stop authenticating instead of remaining valid until restart. Registration releases the htpasswd lock if reading the file fails, and creates the file before locking so concurrent first registrations are no longer lost. Registration in htpasswd now reports every result, including internal errors, through its callback and returns `void`, as the authentication plugin contract requires. Authentication reports invalid plugin group results through the callback instead of throwing.

These issues affect `verdaccio-htpasswd` up to `13.1.3`, `@verdaccio/auth` up to `8.1.3`, `verdaccio-auth-memory` up to `13.1.3` and `@verdaccio/local-storage-legacy` up to `11.4.3`, the modules shipped by the stable `verdaccio@6.10.4`. They reach 6.x once these releases are pinned there. Registry configuration does not need to change.
