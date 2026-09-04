---
'@verdaccio/types': minor
'@verdaccio/core': minor
'@verdaccio/config': minor
'@verdaccio/middleware': minor
'@verdaccio/auth': minor
'@verdaccio/store': minor
'@verdaccio/api': minor
'@verdaccio/ui-components': minor
'@verdaccio/ui-theme': minor
---

feat: staged publishing (`npm stage`) behind the `stage` flag

Adds the `/-/stage` endpoints so a package version can be uploaded for review and
only becomes installable once a maintainer approves it. Everything is gated by
the new `stage` feature flag, which defaults to `false`.

```yaml
flags:
  stage: true
```

The whole `npm stage` family is supported — `publish`, `list`, `view`,
`download`, `approve` and `reject` — verified end to end against npm 11.17.
Staging never asks for a one-time password: deferring proof of presence to
approval time is the point of the flow, which lets a pipeline prepare a release
that a human approves later.

Package access gains a `stage` entry deciding who may submit a version for
review:

```yaml
packages:
  'my-company-*':
    access: $authenticated
    stage: developers
    publish: release-managers
```

It falls back to `publish` when omitted, exactly as `unpublish` already does, so
existing configurations are unaffected. Granting it to a group that lacks
`publish` is what turns review into a real gate: those users can propose a
release but neither publish one directly nor approve their own submission, though
they can always withdraw it. Auth plugins can implement `allow_stage`; returning
`undefined` defers to `allow_publish`.

Staging fires a notification with `publishType: 'stage'` and rejecting fires
`unstage`, so a staged version no longer waits unnoticed until somebody runs
`npm stage list`. Approving keeps reporting `publish`, because that is what it
does.

Staged items are persisted through the storage plugin interface, so any storage
plugin works unchanged, and the namespace is never registered in the plugin
database — staged versions stay out of search and the package list.

The web UI gains a "Staged packages" view (list, detail, approve, reject,
download) that appears only while the flag is on.
