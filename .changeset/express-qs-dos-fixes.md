---
'@verdaccio/middleware': patch
'@verdaccio/test-helper': patch
'verdaccio-audit': patch
---

Update express to 4.22.3 so these packages resolve qs 6.16.0, closing several
denial-of-service advisories in query-string handling that `pnpm audit` reports against
the previous qs 6.15.x: a remotely triggerable crash in `qs.stringify` (TypeError on
crafted input), an `arrayLimit` bypass through bracket-key comma parsing that allows
memory exhaustion, and a DoS via an attacker-controlled `isBuffer` check
(GHSA-4mjr-xmp4-gh2g). Request parsing behaviour is otherwise unchanged and operators
need no configuration change; verdaccio 6.x picks the fix up when it bumps these
dependencies.
