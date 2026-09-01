---
'@verdaccio/store': patch
'@verdaccio/api': patch
'@verdaccio/middleware': patch
'@verdaccio/proxy': patch
---

fix uplink failure handling and abbreviated metadata parity

- api/middleware: when a tarball stream fails after the response headers were
  already sent (eg. the uplink dropped the connection mid-download), the
  response is now destroyed so the client sees the failure immediately —
  previously the connection was left open and the client hung forever waiting
  for a body that would never complete.
- proxy: the got retry limit is no longer derived from `max_fails` (the
  circuit-breaker threshold). A high `max_fails` multiplied every uplink
  timeout by that value, so a slow uplink could block requests almost
  indefinitely. Retries now have their own `retry` uplink setting (default 2,
  matching got).
- store: the abbreviated manifest (`application/vnd.npm.install-v1+json`) no
  longer includes `readme`, `readmeFilename`, `_id` and `_rev`, matching the
  npm registry contract and the Verdaccio 6 behavior — the install-v1 format
  exists precisely to keep install metadata small.
