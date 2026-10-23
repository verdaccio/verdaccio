---
'@verdaccio/api': patch
'@verdaccio/store': patch
---

Restrict version unpublishing to registry requests that passed the unpublish authorization route. Publish requests can no longer be interpreted as version removals based only on the shape of their package metadata.

Deprecation updates continue to work through the publish route when they retain all stored versions. This corrects metadata update handling in the 9.x prerelease line and requires no configuration changes.
