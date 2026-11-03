---
'@verdaccio/core': patch
'@verdaccio/package-filter': patch
---

Update package rule matching to minimatch 11. Package requests previously failed with HTTP 500 when an installation forced minimatch 11, because the access-rule matcher called the removed `makeRe` API. Use the supported matching API while retaining case-insensitive package access rules and first-match precedence.

Update the package filter's direct minimatch dependency as well. Existing package access and filter configuration does not need to change.
