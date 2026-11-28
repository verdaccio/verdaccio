---
'@verdaccio/store': patch
---

Fix the publish check against uplinks being skipped when `publish.allow_offline` is not set.

The docs and the default config describe `allow_offline: false` as the default, but the publish path only looked into the uplinks when the key was set to `false` explicitly. With the key unset, a version that already exists on an uplink could be published locally instead of being refused with `409`. An unset value now behaves like `false`, and `allow_offline: true` keeps skipping the lookup.
