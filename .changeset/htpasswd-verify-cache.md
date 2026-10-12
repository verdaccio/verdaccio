---
'verdaccio-htpasswd': minor
---

feat(htpasswd): cache successful password verifications

Clients that authenticate with username and password send them on every request, so one install triggered a bcrypt verification per tarball. Successful verifications are now remembered for `verify_cache_ms` (default 60000, `0` disables), and identical verifications already in flight are shared. The cache key is an HMAC of user, password and stored hash, so a password change invalidates it immediately.
