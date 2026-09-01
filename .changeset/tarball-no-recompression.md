---
'verdaccio': patch
---

fix: stop re-compressing tarballs for gzip-accepting clients

mime-db marks `application/octet-stream` as compressible, so the compression
middleware re-gzipped every (already gzipped) `.tgz` download for clients
that accept gzip — npm and undici do by default — wasting CPU on every
download and stripping the `Content-Length` header. Tarball responses are
now excluded from compression; JSON metadata responses stay compressed.
