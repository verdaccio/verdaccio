---
'@verdaccio/search-indexer': patch
---

Replace Orama with ZBSearch for the in-memory private package index.

The library keeps its existing methods, indexed metadata and search response fields,
including the total match count and the limit of ten hits. Search uses ZBSearch's native
relevance scoring, so scores and result ordering can differ from Orama 1.2.11.
No configuration changes are required.

Initialization and reindexing now resolve after the supplied private packages have been
indexed. Storage read errors reject the operation instead of escaping an unawaited callback;
invalid packages are still logged and skipped while the remaining packages are loaded.
