---
'@verdaccio/store': patch
---

fix(store): enforce `publish.check_owners` on deprecate and version unpublish

`npm deprecate` and version-level unpublish both mutate the package through `changePackage` without the store-level ownership check used by publish, owner changes, tarball removal, and package removal. With `unpublish: $authenticated`, that check is the only owner protection on `PUT /:package/-rev/:revision`.
