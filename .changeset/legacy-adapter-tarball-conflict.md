---
'verdaccio': patch
---

Stop cutting tarball downloads short when a callback-based storage plugin already has the tarball.

When several clients requested the same uncached tarball from an uplink at about the same time, each request started its own write to the local cache. A callback-based storage plugin reports the later writes as "already exists": `verdaccio-aws-s3-storage` with a 409, and plugins built on `@verdaccio/local-storage-legacy` with `EEXISTS`. The compatibility adapter treated that as a failure and destroyed the cache write. That also ended the response streaming the tarball to the client, so the client received a 200 with a partial body and the request was logged as a 499. Under parallel installs on a cold cache, `npm ci` failed with `ECONNRESET`.

The adapter now treats "already exists" as already cached: it stops writing to the plugin and lets the download finish, as Verdaccio 6 did for uplink caching. Other plugin errors still fail the cache write. The adapter cannot tell a cache write from a publish, so a publish that loses a race with another write of the same tarball now completes instead of returning a 409. Publishing checks for an existing tarball first, so this happens only when two writes of the same file overlap. Promise-based storage plugins such as `@verdaccio/local-storage` are not affected.
