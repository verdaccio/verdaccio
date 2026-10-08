---
'@verdaccio/store': patch
'verdaccio-memory': patch
---

Return the expected not-found response when a requested version or dist-tag is absent, while continuing to resolve explicitly stored versions and tags.

The memory storage plugin now distinguishes stored packages from inherited object properties when checking, reading, and updating packages. Missing packages return a not-found error, including after removal. No configuration changes are required.
