---
'@verdaccio/auth': patch
'@verdaccio/config': patch
'@verdaccio/types': patch
---

Add an opt-in cache for successful legacy AES token authentication. Enable it with `server.legacyAuthCache.enabled: true`; when enabled, the default TTL is 15 seconds and concurrent requests for the same legacy bearer token share the same in-flight authentication result.
