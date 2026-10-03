---
'@verdaccio/core': patch
---

Validate scoped names in `validateName` with the same rules as `validatePackage`.

`validateName` checks the route parameters of the registry API, such as tarball file names, versions, dist-tags and tokens. A value that starts with `@` and contains `/` is now accepted only in the `@scope/name` form, with both the scope and the name passing the usual package name rules. Values that do not meet these rules are now rejected as invalid parameters (HTTP 400), as other invalid names already were. Regular names, `@scope/name` values and values without a separator behave as before. Registry configuration does not need to change.
