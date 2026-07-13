---
'@verdaccio/types': patch
'@verdaccio/hooks': patch
---

feat: add publish/unpublish hooks

Port of https://github.com/verdaccio/verdaccio/pull/5920 to the 8.x line: the
`notify` hook accepts a `publishType` (`publish` | `unpublish`) that is exposed
to notification templates together with `publishedPackage`, and the `publisher`
template object now exposes only `name`, `groups` and `real_groups` (never the
remote user token).
