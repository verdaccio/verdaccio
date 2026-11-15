---
'verdaccio': patch
---

Stop truncating tarball downloads when a callback-based storage plugin already has the tarball cached.

When several clients requested the same uncached tarball from an uplink at about the same time, each request started its own write to the local cache. A callback-based storage plugin (such as `verdaccio-aws-s3-storage`) reports the later writes with a 409, because the tarball is already stored. The compatibility adapter treated that 409 as a failure and destroyed the cache-write stream. The same pipeline also streams the tarball to the client, so that client received a 200 response with a partial body, and the request was logged as a 499 "request aborted by client". Under parallel installs on a cold cache, `npm ci` failed with `ECONNRESET`.

The adapter now treats the 409 as "already cached": it stops writing to the plugin and lets the download finish, which is what Verdaccio 6 did. Any other error from the plugin still fails the cache write as before. This affects Verdaccio 7 pre-releases with callback-based storage plugins; promise-based plugins such as `@verdaccio/local-storage` were not affected.
