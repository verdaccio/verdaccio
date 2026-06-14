---
'@verdaccio/api': major
'@verdaccio/store': major
'@verdaccio/middleware': major
---

Remove star/unstar support

The `npm star`/`npm unstar` feature has been removed. This drops the
`/-/_view/starredByUser` listing endpoint, the metadata-based star/unstar
handling in the publish flow (`storage.star()` and the `users` payload
branch in `updateManifest`), the `StarManifestBody` type, and the
`STARS_API_ENDPOINTS` middleware constant.
