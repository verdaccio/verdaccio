---
'@verdaccio/store': patch
'@verdaccio/proxy': patch
---

Answer 503 instead of 404 when a package or tarball is missing locally and the uplink could not be reached. A tarball request for a version absent from the cached manifest now refreshes the manifest from the uplink even within `maxage`, so a just-published version is not reported as missing. An uplink marked offline accepts requests again once `fail_timeout` has passed.
