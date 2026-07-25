---
"verdaccio": patch
---

fix(deps): update @verdaccio/hooks to 8.1.1

Restores publish/unpublish webhook notifications when running on the ESM build: hooks
8.1.0 could not send them (the notify client failed silently on every call). The new
version replaces the frozen `got-cjs` fork with `got` 15 loaded in a way that works
from both the ESM and CommonJS builds, and reports delivery failures based on the real
HTTP response status.
