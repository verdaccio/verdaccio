---
'@verdaccio/core': patch
---

Validate scoped names in `validateName` with the same rules as `validatePackage`.

`validateName` checks the route parameters of the registry API, such as tarball file names, versions, dist-tags and tokens. A value that starts with `@` and contains `/` is now accepted only in the `@scope/name` form, with both the scope and the name passing the usual package name rules. Values that do not meet these rules are now rejected as invalid parameters (HTTP 400), as other invalid names already were. Regular names, `@scope/name` values and values without a separator behave as before.

This affects `@verdaccio/core` up to `8.3.0`, used by the stable `verdaccio@6.10.4`, and reaches 6.x once this release is pinned there. Registry configuration does not need to change.
