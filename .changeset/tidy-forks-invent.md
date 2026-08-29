---
'@verdaccio/types': minor
'@verdaccio/config': minor
'@verdaccio/core': minor
'@verdaccio/middleware': minor
'@verdaccio/store': minor
'@verdaccio/api': minor
'@verdaccio/ui-components': minor
'@verdaccio/ui-theme': minor
---

feat: staged publishing (`npm stage`) behind the `stage` flag

Adds the `/-/stage` endpoints so a version can be uploaded for review and only
becomes installable once a maintainer approves it. Verified end to end against
npm 11.17: `stage publish`, `stage list`, `stage view`, `stage download`,
`stage approve` and `stage reject`.

Staged items are persisted through the storage plugin interface, so any storage
plugin works without changes, and the namespace is never registered in the plugin
database — staged versions stay out of search and the package list.

The web UI gains a "Staged packages" view (list, detail, approve, reject,
download) that appears only while the flag is on.

A `tfa` flag is also reserved, defaulting to `false` and doing nothing yet; TOTP
two-factor authentication lands in a follow-up change.

Both flags default to `false`, so the registry behaves exactly as before unless
they are enabled.
