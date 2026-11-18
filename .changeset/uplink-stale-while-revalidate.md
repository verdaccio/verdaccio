---
'@verdaccio/types': minor
'@verdaccio/proxy': minor
'@verdaccio/store': minor
---

Add the `stale_while_revalidate` uplink option.

When a proxied package's cached metadata is older than the uplink `maxage`, the next request for it waits for the whole refresh: the uplink round trip, the merge and the storage write. Behind a slow upstream, such as a supply-chain firewall proxy, that is several seconds, and package managers that resolve the dependency graph one level at a time wait on the slowest of those requests at every level.

`stale_while_revalidate` takes an interval in the same syntax as `maxage`: how long past `maxage` a stored manifest may still be served while a refresh runs. With it set on an uplink, a metadata request for a package whose uplinks have all been fetched before, at least one of which is past `maxage` but still inside `maxage + stale_while_revalidate`, is answered from the stored manifest, and one refresh per package runs in the background and writes the fresh copy back. A manifest older than that window refreshes synchronously, so staleness is bounded. Concurrent requests for the same package share that refresh. A refresh that neither completes nor fails within the uplink `timeout` (at least 30 s) is treated as abandoned so the next request may start another. Failures are logged at `warn`; a `304` is not a failure.

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
    maxage: 30m
    stale_while_revalidate: 24h
```

The option is off by default. Only uplinks that set it take part, so a package proxied through one that does not keeps the synchronous refresh, as do packages never fetched before and tarball lookups. Right after an expiry a version published upstream since the last fetch becomes visible one request later: a dist-tag or semver range resolves from the stored copy, and a request for an exact version published in that gap fails once before the refresh lands. The merge never removes a version or moves a dist-tag back.
