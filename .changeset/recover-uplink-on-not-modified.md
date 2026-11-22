---
'@verdaccio/proxy': patch
---

Restore uplink access when the first response after an outage is `304 Not Modified`.

In Verdaccio 7.1.2, an uplink could stay marked offline after confirming that cached package metadata was current. Requests for uncached packages could return 404 until another recovery attempt. Verdaccio now treats a 304 as a successful recovery and immediately sends subsequent requests to the uplink. Upgrade to receive the fix with your existing configuration.
