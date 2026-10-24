---
'@verdaccio/store': patch
'@verdaccio/local-storage': patch
---

Reject tarball uploads when destination setup fails, propagate cancellation before the file opens, and prevent premature stream closure from recording a successful upload. Clean failed upload files after their descriptors close so incomplete tarballs are not kept as final files.

Wait for the temporary tarball to be renamed before recording upload success, and propagate rename and descriptor-close failures to the caller. Verify cleanup, preservation of existing files, retries, and complete binary uploads with the real filesystem.
