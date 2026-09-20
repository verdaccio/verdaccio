---
'verdaccio': patch
---

Update express to 4.22.3 — directly and through `@verdaccio/middleware` 8.1.4,
`verdaccio-audit` 13.1.4 and `@verdaccio/test-helper` 4.1.4 — so the registry's entire HTTP
stack resolves qs 6.16.0, which fixes several denial-of-service advisories in query-string
handling: a remotely triggerable crash in `qs.stringify` (TypeError on crafted input), an
`arrayLimit` bypass through bracket-key comma parsing that allows memory exhaustion, and a
DoS via an attacker-controlled `isBuffer` check (GHSA-4mjr-xmp4-gh2g). A `body-parser/qs`
resolution covers the one remaining consumer that pins qs below the fix. Query-string
parsing behaviour is otherwise unchanged and no configuration change is needed.

The same update refreshes the development dependency tree, clearing every high-severity
`yarn npm audit` finding (stale transitive resolutions of tar, minimatch, socks/ip, js-yaml,
form-data, nanoid, postcss, picomatch, tmp and systeminformation, plus vitest 4.1.11 for the
`@vitest/mocker` path-traversal advisory) — none of these ship in the published package.
