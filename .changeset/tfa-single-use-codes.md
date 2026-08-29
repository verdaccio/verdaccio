---
'@verdaccio/auth': patch
'@verdaccio/store': patch
---

fix: reject replayed one-time passwords and invalid staged tarball names

Two problems found while auditing the staged publishing and two-factor work,
both reproduced against a running registry before being fixed.

A one-time password could be used more than once. Codes stay valid for up to 90
seconds with the tolerance window, so a code seen in a CI log or over someone's
shoulder authorised every write in that window — three publishes went through
with one code. RFC 6238 §5.2 requires single use, so the accepted time step is
now recorded and anything at or before it is refused.

The tarball name of a staged version came from the `_attachments` key of the
request and reached the storage plugin unchecked. A name of `..` made the write
fail inside a stream handler nobody awaits, which crashed the process: any user
allowed to stage could take the registry down with one request. The regular
publish path already asserted the name; staging now does too.
