---
'@verdaccio/auth': patch
'@verdaccio/config': patch
---

Disable the legacy auth cache by default; it must now be opted in via `server.legacyAuthCache.enabled: true`. While enabled, changed or revoked credentials stay valid until the cached entry expires, so the default TTL is 30 seconds (down from 5 minutes) and remains configurable via `server.legacyAuthCache.ttlMs`. Concurrent requests for the same token still share a single cache write from the leader request instead of each re-writing the entry.
