---
'@verdaccio/store': patch
'@verdaccio/core': patch
'@verdaccio/api': patch
'@verdaccio/local-storage': patch
---

fix(store): enforce `publish.check_owners` on deprecate, version unpublish and dist-tags

`npm deprecate`, version-level unpublish and dist-tag changes all mutate the package through the store without the store-level ownership check used by publish, owner changes, tarball removal, and package removal. With `unpublish: $authenticated`, that check is the only owner protection on these routes.

- `deprecate` and `unPublishAPackage` now run the ownership check against the stored manifest before applying the change; the package name is always taken from the request URL, never from the request body.
- `mergeTagsNext` (dist-tag add/rm) now runs the ownership check as well.
- `changePackage` no longer wipes the stored `maintainers` list when the request body omits it (e.g. deprecate bodies), which previously turned the ownership check into a no-op for that package.
- Cached manifests of proxied packages now record the upstream maintainers, so the ownership check also protects them (they were created with an empty list, which skips the check).
- `changePackage` rejects bodies whose `_rev` is missing or empty (422) or does not match the stored revision (409); a deprecate without a revision, or with a stale one, no longer silently drops concurrently published versions, and a stale version unpublish no longer reports success without applying (which made npm delete the tarball anyway). Empty `_rev` is also rejected by the unpublish body schema.
- `changeOwners` keeps the request body's `_rev` when calling `changePackage` instead of substituting the latest local revision, so a concurrent owner update with a stale revision is rejected rather than overwriting the other change.
- The owner pre-check on `GET /:package?write=true` now actually runs (it read a request option that was never set) and returns 403 instead of wrapping it into a 400.
- fix(local-storage): errors thrown by the `updatePackage` handler are no longer masked as `resource temporarily unavailable` after unlocking; the original error (403 forbidden, 404 unknown tag version, 409 conflict) reaches the client.
