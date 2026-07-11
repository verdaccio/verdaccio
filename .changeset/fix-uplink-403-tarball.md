---
"verdaccio": patch
---

fix: return 403 to client when uplink responds with 403 for tarball requests

Previously, any non-200/404 response from an uplink (e.g. a security proxy blocking a package download) would result in a generic 500 error being returned to the client. This change propagates 403 responses from the uplink through to the client, including any error detail from the response body, so callers can distinguish authorization failures from other upstream errors.
