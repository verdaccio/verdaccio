---
'@verdaccio/auth': patch
'@verdaccio/config': patch
'@verdaccio/types': patch
---

Cache successful legacy AES token authentication for a short configurable window.

The cache is enabled by default under `server.legacyAuthCache` and avoids running password verification, including bcrypt-backed htpasswd verification, for every request that reuses the same legacy token. Concurrent requests for the same token now share one in-flight authentication result. The cache can be tuned or disabled with `server.legacyAuthCache.enabled`, `server.legacyAuthCache.maxEntries`, and `server.legacyAuthCache.ttlMs`.
