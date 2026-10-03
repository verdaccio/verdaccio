---
'@verdaccio/core': patch
---

Align package name validation with npm.

`@verdaccio/core` now includes `validatePackageName`, which returns whether a name follows the npm package name rules for existing packages. `validatePackage` uses it, so it now also rejects names that start with an underscore, contain characters that are not URL-friendly, or use `@` without a scope. Names with capital letters, names longer than 214 characters and names that start with a hyphen remain valid, so existing packages can still be served. `validateName`, used for route parameters such as versions, dist-tags and tarball file names, does not change.

Requests that use such names are rejected as invalid (HTTP 400). Registry configuration does not need to change.
