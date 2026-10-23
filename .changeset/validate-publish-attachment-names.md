---
'@verdaccio/store': patch
---

Reject invalid tarball attachment names with a 400 response before saving a published version or its tags. Previously, a malformed attachment name could fail after metadata had been saved, leaving a version without a tarball and preventing a corrected publish of the same version. Correcting the attachment name now allows that version to be published normally.

Scoped attachment names sent by npm and Yarn and legacy tarball filenames remain supported. This fixes the normal publish flow in the 9.x storage implementation; no configuration changes are required.
