---
"verdaccio": patch
---

fix: rate limit and bound the npm search v1 endpoint

The `/-/v1/search` endpoint now applies the `userRateLimit` rate limiting middleware (matching the login, token and profile endpoints), clamps the `size` (max 250, like the public npm registry) and `from` (max 10000) pagination parameters, and stops evaluating package access as soon as the requested page is filled instead of running an auth check over the entire result set. The clamped values are also what gets forwarded to uplink registries (the raw request URL is no longer passed through), so the bounds hold end-to-end. This prevents cheap anonymous requests from triggering unbounded full-catalog scans. As part of this, pagination is fixed: results were sliced with `slice(from, size)` instead of `slice(from, from + size)`, so pages beyond the first were wrong.

Search results for local packages also emit npm-search-compatible maintainers (`{ username, email }`) — npm 11 on Node 24 crashes rendering entries without `username` (`The "str" argument must be of type string. Received undefined`) — and the `publisher` field is now populated from `_npmUser` when the publishing client provided it, falling back to the first maintainer, so the npm CLI shows the publishing user instead of `by ???`.
