---
'@verdaccio/ui-components': patch
---

Downloading a staged tarball produced a corrupted archive: the API client decoded `application/octet-stream` responses as text (invalid utf-8 bytes became U+FFFD) because only `.tgz`-suffixed urls were treated as binary. Binary content types are now always handled as blobs.
