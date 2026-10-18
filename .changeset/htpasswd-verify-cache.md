---
'verdaccio-htpasswd': minor
---

feat(htpasswd): cache successful password verifications

Clients that authenticate with username and password send them on every request, so one install triggered a bcrypt verification per tarball. Setting `verify_cache_ms` now remembers successful verifications for that long (off by default), and identical verifications already in flight are shared. Expired entries are removed from memory within about twice the TTL. The cache key is an HMAC of user, password and stored hash, so a password change invalidates it immediately.
