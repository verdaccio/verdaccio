---
'@verdaccio/core': patch
---

Reject package names with extra path separators in `validatePackage`

`validatePackage` split the name with a limit, which ignored any separators past
the second segment and accepted non-canonical names such as `@scope/pkg/`. The
name is now split on every separator and only one- or two-segment names are
considered valid, so a package name has a single canonical form.
