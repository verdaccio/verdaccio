---
'@verdaccio/api': minor
'@verdaccio/store': minor
'@verdaccio/core': minor
'@verdaccio/middleware': minor
'@verdaccio/server': patch
---

Add `GET /-/package/{package-name}/version/{version}/status` for authenticated users with publish access. The response contains `packageName`, `version`, and `status` (`published` or `staged`). Invalid names and non-exact versions return 400 before authentication; missing credentials return 401, and missing versions or denied package access return the same 404.

Published versions are resolved from local metadata (including cached metadata), with manifest filters applied, without contacting uplinks. Staged versions are available when `flags.stage` is enabled; the endpoint also works for published versions with staging disabled. This is a local view, not a live status query to upstream registries.

Verdaccio does not track automated validation, moderation, or deletion history, so it does not emit `validating`, `blocked`, or `deleted`. Versions no longer present locally or in staging return 404. No storage migration is required.

Staged version listings and details also include `status: "staged"`, allowing npm stage clients to display that the version is ready for maintainer review. Existing records receive this field when read.
