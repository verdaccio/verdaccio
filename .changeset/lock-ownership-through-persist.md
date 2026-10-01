---
'@verdaccio/store': patch
'verdaccio-memory': patch
---

Keep `publish.check_owners` in effect until a deprecate or version unpublish is saved.

On 9.x, with `publish.check_owners` enabled, `npm deprecate` and version unpublish checked ownership and then saved the manifest after the package lock was released. A concurrent owner change could save a new maintainer list in that gap, and the in-flight update could still save the manifest it had already authorized. Ownership is now checked on the manifest read under the package lock, and the updated manifest is saved before that lock is released.

The memory storage plugin keeps the HTTP status of an error raised while a package is updated, so a rejected update stays forbidden instead of becoming an internal error.
