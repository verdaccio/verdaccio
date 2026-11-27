---
'@verdaccio/store': patch
---

Fix search failing with 500 when the storage plugin lists a package that no longer exists.

Search reads the manifest of every local package the storage plugin returns. When one of those names had no manifest, for example a name left in the plugin's package list after an unpublish, the whole search failed with `no such package available`, and the web UI search returned 500. That package is now skipped with a warning in the log, and the other results are returned. Any other error reading a package still fails the search.
