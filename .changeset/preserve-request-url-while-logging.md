---
'@verdaccio/middleware': patch
---

Preserve request routing while writing HTTP logs, including when middleware waits for asynchronous work or the registry is mounted under a URL prefix.

Request logging now reads the original URL without assigning it to the URL used by Express routers. Logs retain the full request URL and credential masking. This removes a timing-dependent URL rewrite that could interfere with nested routers.

Verdaccio 6.2.0 through 6.11.2 also require the companion web route correction before consuming this update: those versions register absolute web API paths beneath a mounted prefix and can depend on the old logging behavior to match them. Release the middleware update together with the corrected routing in the 6.x consumer.
