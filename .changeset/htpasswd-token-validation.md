---
'verdaccio-htpasswd': patch
'@verdaccio/auth': patch
'verdaccio-auth-memory': patch
'@verdaccio/local-storage-legacy': patch
---

Improve validation of user registration, authentication and API tokens.

User and token lookups in the htpasswd, in-memory auth and legacy token stores now consider only stored entries. When htpasswd reloads its file, users removed from it stop authenticating instead of remaining valid until restart. Registration releases the htpasswd lock if reading the file fails, and creates the file before locking so concurrent first registrations are no longer lost. Authentication reports invalid plugin group results through the callback instead of throwing.
