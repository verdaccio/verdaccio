---
"verdaccio": patch
---

fix(deps): update @verdaccio/* packages to the 2026-07-25 release batch

Updates all `@verdaccio/*` and `verdaccio-*` dependencies (config 8.1.4, core 8.1.4,
auth 8.0.6, middleware 8.0.7, htpasswd/audit 13.0.5, among others). Notably
`@verdaccio/config` 8.1.4 moves to `js-yaml` 4.3.0, resolving the high-severity
advisory [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m)
(YAML merge-key chains forcing quadratic CPU consumption).
