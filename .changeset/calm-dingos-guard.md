---
'@verdaccio/api': patch
'@verdaccio/store': patch
---

Restrict version unpublishing to registry requests that passed the unpublish authorization route. Publish requests can no longer be interpreted as version removals based only on the shape of their package metadata.
