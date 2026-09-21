---
'@verdaccio/proxy': patch
---

Preserve the original cause in web search error logs when an uplink fails without an HTTP response or returns invalid JSON. DNS failures, refused or interrupted connections, timeouts, and cancellation no longer produce a secondary `TypeError` while handling the error.

This affects the proxy modules on the 9.x line and the Verdaccio 7 releases that consume them. Web searches continue returning permitted local packages and results from healthy uplinks.
