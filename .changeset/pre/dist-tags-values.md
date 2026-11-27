---
'@verdaccio/store': patch
---

Ignore malformed `dist-tags` values and skip packages that fail to load during search, so one bad manifest no longer breaks `/-/v1/search` for everyone.
