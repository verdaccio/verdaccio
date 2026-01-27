---
'@verdaccio/package-filter': patch
'@verdaccio/store': patch
---

- Add @verdaccio/package-filter plugin.
- Fix filter plugin invocations in Storage.
  - Fix local manifest not filtered when no uplinks configured (e.g. they were removed at some point).
  - Fix only one filter plugin is applied (last).
