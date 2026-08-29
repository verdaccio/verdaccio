---
'@verdaccio/types': minor
'@verdaccio/core': minor
'@verdaccio/config': minor
'@verdaccio/auth': minor
'@verdaccio/api': minor
---

feat: `stage` package access permission

Adds a `stage` entry to package access, deciding who may submit a version for
review with `npm stage publish`:

```yaml
packages:
  'my-company-*':
    access: $authenticated
    stage: developers
    publish: release-managers
```

It falls back to `publish` when omitted, exactly as `unpublish` already does, so
existing configurations are unaffected.

Granting it to a group that lacks `publish` is what turns staged publishing into
a real review gate: those users can propose a release but neither publish one
directly nor approve their own submission. They can still withdraw it, since
retracting your own proposal is not the same as rejecting somebody else's.

Auth plugins can implement `allow_stage`; returning `undefined` defers to
`allow_publish`.
