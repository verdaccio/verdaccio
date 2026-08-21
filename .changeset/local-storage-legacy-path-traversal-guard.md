---
'@verdaccio/local-storage-legacy': patch
---

fix: confine local-storage-legacy file paths to the storage root

Harden the legacy local-storage plugin against path traversal. Package and
tarball names are now resolved against the configured storage root and rejected
if the resulting path would escape it, on top of the existing filename
sanitization. This mirrors the same guard in `@verdaccio/local-storage`; there
is no observable change for legitimate package and tarball names.
