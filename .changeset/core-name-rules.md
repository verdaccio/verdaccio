---
'@verdaccio/core': patch
---

Align package name validation with npm.

`@verdaccio/core` now includes `validatePackageName`, which returns whether a name follows the npm package name rules for existing packages. `validatePackage` uses it, so it now also rejects names that start with an underscore, contain characters that are not URL-friendly, or use `@` without a scope. Names with capital letters, names longer than 214 characters and names that start with a hyphen remain valid, so existing packages can still be served.

`validateName`, which also checks route parameters such as tarball file names, versions and dist-tags, now also rejects a trailing dot, `*`, Windows reserved device names such as `con` or `nul`, and values longer than 255 characters.

Requests that use such names are rejected as invalid (HTTP 400) instead of being looked up, so a request for a package such as `_name` now returns 400 instead of 404. Registry configuration does not need to change.
