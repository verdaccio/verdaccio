---
'@verdaccio/core': patch
'@verdaccio/search': patch
'@verdaccio/store': patch
---

Validate package versions before combining search results. Paginated searches return 503 for malformed uplink versions instead of returning invalid results or failing with 500. Invalid local and legacy search entries are omitted. Preserve support for legacy version formats and return their original spelling while comparing versions consistently. When a local package and an uplink report the same version in different spellings, the local entry and its metadata are kept; only a strictly newer version replaces it.
