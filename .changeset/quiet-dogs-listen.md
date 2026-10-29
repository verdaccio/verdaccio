---
'@verdaccio/api': patch
'@verdaccio/store': patch
'@verdaccio/types': patch
---

fix: preserve the stored package manifest's `access` value

The registry previously removed this field when preparing the response, even when it was
present in storage. Full metadata requests now return it unchanged at the top level.
Manifests without `access` and abbreviated install metadata responses remain unchanged.
This does not change the configured package access rules or grant additional permissions.
