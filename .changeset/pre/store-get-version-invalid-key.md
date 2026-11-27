---
'@verdaccio/store': patch
---

Fix `GET /:package/:version` returning `500 Internal Server Error` when the package has a version key that is not valid semver.

Some public packages have such keys in `versions`, for example `10000000000000000.0.0`, which is larger than `Number.MAX_SAFE_INTEGER` and is rejected by `semver`. When the requested version did not match a key exactly, the loose lookup compared it with every key and threw `TypeError: Invalid version` on the bad one. A missing version then answered 500 instead of 404, and a loose lookup such as `v1.0.0` could fail even though `1.0.0` exists. Keys that are not valid semver are now skipped during the loose lookup, so these requests answer 404 or the matching version again.
