---
'@verdaccio/ui-theme': patch
---

The router used the raw `url_prefix` config value as `basename`, so a prefix without a leading slash (e.g. `url_prefix: 'verdaccio/'`) rendered a blank page, and deployments driven by `VERDACCIO_PUBLIC_URL` alone showed a 404 on every route. The UI now uses the normalized `basename` the server already computes for this purpose.
