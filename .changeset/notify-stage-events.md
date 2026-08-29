---
'@verdaccio/types': minor
'@verdaccio/api': minor
---

feat: notify when a version is staged or a staged version is rejected

Staging a version now fires a notification with `publishType: 'stage'`, and
rejecting one fires `publishType: 'unstage'`. Approving keeps reporting
`publish`, because that is what it does — a consumer listening for publishes
must still see it.

This makes the review step usable in practice: a staged version needs a human to
act on it, and until now nothing announced that it was waiting.
