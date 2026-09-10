---
'@verdaccio/local-storage': patch
---

fix: failed tarball downloads must not crash the registry nor be renamed into place

When an uplink download failed (for example a timeout), three cleanup paths
raced over the same temporal file: the unconditional close handler renamed
the truncated temporal file to the final tarball name, and the error and
abort listeners then both tried to unlink it — the second unlink rejected
with ENOENT from an event listener and surfaced as an uncaught exception
("please report this bug").

An errored or aborted write now never renames the temporal file (a
truncated tarball must not appear under the final name), and the temporal
cleanup is idempotent and never throws: ENOENT is expected when the other
path got there first, anything else is logged as a warning.
