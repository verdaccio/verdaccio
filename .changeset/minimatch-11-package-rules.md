---
'@verdaccio/core': patch
'@verdaccio/package-filter': patch
---

Fix HTTP 500 responses for package requests when an installation forces minimatch 11. The access-rule matcher called the removed `makeRe` API. Use the supported matching API while retaining case-insensitive package access rules and first-match precedence.

On the master and 7.x release lines, affected `@verdaccio/core` releases are `9.0.0-next-9.0` through `9.0.0-next-9.41`. Verdaccio releases using these modules include `9.0.0-next-9.0` through `9.0.0-next-9.41` and stable releases `7.0.0` through `7.0.2`. The affected 7.x prereleases using these modules are `7.0.0-beta.4`, `7.0.0-beta.6`, and `7.0.0-next-7.21` through `7.0.0-next-7.32`.

The failure requires an override or resolution that replaces the declared minimatch dependency with version 11; default installations of those releases are not affected. Upgrade to a Verdaccio release containing the corrected core module before forcing minimatch 11.

Update the package filter's direct minimatch dependency as well. Existing package access and filter configuration does not need to change.
