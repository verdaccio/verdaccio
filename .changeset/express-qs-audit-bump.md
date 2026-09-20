---
'verdaccio': patch
---

Update express to 4.22.3 so the registry's HTTP stack resolves qs 6.16.0, which fixes several
denial-of-service advisories in query-string handling: a remotely triggerable crash in
`qs.stringify` (TypeError on crafted input), an `arrayLimit` bypass through bracket-key comma
parsing that allows memory exhaustion, and a DoS via an attacker-controlled `isBuffer` check
(GHSA-4mjr-xmp4-gh2g). Query-string parsing behaviour is otherwise unchanged and no
configuration change is needed.

The same update refreshes the development dependency tree, clearing every high-severity
`yarn npm audit` finding (stale transitive resolutions of tar, minimatch, socks/ip, js-yaml,
form-data, nanoid, postcss, picomatch, tmp and systeminformation, plus vitest 4.1.11 for the
`@vitest/mocker` path-traversal advisory) — none of these ship in the published package.
