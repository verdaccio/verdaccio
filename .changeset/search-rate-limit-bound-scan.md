---
'@verdaccio/api': patch
---

fix: rate limit and bound the npm search v1 endpoint

The `/-/v1/search` endpoint now applies the `userRateLimit` rate limiting middleware (matching the login, token and profile endpoints), clamps the `size` (max 250, like the public npm registry) and `from` (max 10000) pagination parameters, and stops evaluating package access as soon as the requested page is filled instead of running an auth check over the entire result set. This prevents cheap anonymous requests from triggering unbounded full-catalog scans. As part of this, the previously broken `size`/`from` query parsing (which always fell back to the defaults) now works, so search pagination is honored.
