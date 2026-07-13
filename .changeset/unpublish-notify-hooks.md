---
"verdaccio": minor
---

feat: add unpublish notification hooks

Port of [#5920](https://github.com/verdaccio/verdaccio/pull/5920) (ref [#5328](https://github.com/verdaccio/verdaccio/issues/5328)). The `notify` webhook now also fires when a package is unpublished entirely and when a single version (tarball) is removed, not only on publish. Notification templates can distinguish the event through the new `{{ publishType }}` (`publish` | `unpublish`) and `{{ publishedPackage }}` variables, and the `{{ publisher }}` object exposes only `name`, `groups` and `real_groups`, so the remote user auth token can never leak to the notification endpoint (via `@verdaccio/hooks` 8.0.4).
