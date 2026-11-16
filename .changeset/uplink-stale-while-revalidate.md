---
'@verdaccio/types': minor
'@verdaccio/proxy': minor
'@verdaccio/store': minor
---

Add the `stale_while_revalidate` uplink option.

When a proxied package's cached metadata is older than the uplink `maxage`, the next request for it waits for the whole refresh: the uplink round trip, the merge and the storage write. Behind a slow upstream, such as a supply-chain firewall proxy, that is several seconds, and package managers that resolve the dependency graph one level at a time wait on the slowest of those requests at every level.

With `stale_while_revalidate: true` on an uplink, a metadata request for a package whose uplinks have all been fetched before, and at least one of which is past `maxage`, is answered from the stored manifest, and one refresh per package runs in the background and writes the fresh copy back. Concurrent requests for the same package share that refresh. A refresh that neither completes nor fails within the uplink `timeout` (at least 30 s) is treated as abandoned so the next request may start another. Failures are logged at `warn`; a `304` is not a failure.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    maxage: 30m
    stale_while_revalidate: true
```

The option is off by default. Only uplinks that enable it take part, so a package proxied through one that does not keeps the synchronous refresh, as do packages never fetched before and tarball lookups. Right after an expiry a version published upstream within the last `maxage` becomes visible one request later; only dist-tags and semver ranges can observe that, an exact version resolves the same from either copy, and the merge never removes a version or moves a dist-tag back.
