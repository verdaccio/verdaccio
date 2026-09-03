---
'@verdaccio/store': patch
'@verdaccio/api': patch
'@verdaccio/middleware': patch
'@verdaccio/proxy': patch
'@verdaccio/server': patch
'@verdaccio/core': patch
---

fix: tarball download reliability — uplink selection, no client hangs, content-length, npmjs parity

- **store**: tarballs with a missing `_distfiles` record no longer 404 forever —
  `lookupDistFile` falls back to the version's own dist metadata (conventional
  `<name>-<version>.tgz` fast path, then a full scan that also resolves
  bare-digest tarball urls). The uplink for a tarball is now the one that
  actually serves it (recorded on the distfile, or matched by url on a path
  segment boundary) instead of the last configured match, so credentials of an
  unrelated uplink are never sent to it.
- **api/middleware**: when a tarball stream fails after the response headers
  were already sent (eg. the uplink dropped the connection mid-download), the
  response is destroyed so the client sees the failure immediately instead of
  hanging forever; when it fails before headers are sent, the error body is
  served as JSON like registry.npmjs.org.
- **proxy**: the got retry limit is no longer derived from `max_fails` (the
  circuit-breaker threshold) — a high `max_fails` multiplied every uplink
  timeout, so a slow uplink could block requests almost indefinitely. Retries
  have their own `retry` uplink setting (default 2, matching got).
- **store**: the abbreviated manifest (`application/vnd.npm.install-v1+json`)
  no longer includes `readme`, `readmeFilename`, `_id` and `_rev`, matching
  the npm registry contract.
- **store/server**: tarball responses now carry a `Content-Length` header (the
  `content-length` event was swallowed by the stream wrapper) and are no
  longer re-gzipped by the compression middleware for gzip-accepting clients —
  npm and undici accept gzip by default, so every (already gzipped) `.tgz`
  download paid CPU for nothing. JSON metadata responses stay compressed.
- **core**: the `application/octet-stream` constant no longer carries a
  spurious `charset=utf-8`, matching registry.npmjs.org.
