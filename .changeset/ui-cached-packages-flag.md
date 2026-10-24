---
'@verdaccio/types': minor
'@verdaccio/config': minor
'@verdaccio/middleware': minor
'@verdaccio/store': minor
'@verdaccio/web': minor
'@verdaccio/ui-components': minor
'@verdaccio/ui-theme': minor
---

Add an experimental `flags.cachedPackages` option that lists packages cached from uplinks in the web UI, next to the private ones.

The home page has only ever listed packages published to the registry, so a registry used mostly as a proxy looked empty even with thousands of packages on disk. With `flags.cachedPackages: true` the list also shows cached packages, and every entry carries a "Private" or "Cached" badge.

Cached packages are loaded in pages of 50 while you scroll, from a new `GET /-/verdaccio/data/packages/cached?offset=&limit=` endpoint (at most 100 per page). The list of cached names comes from the storage plugin's `search` and is reused for 30 seconds. Package access rules and filter plugins apply as they do for the private list. The private list endpoint works as before and only adds an `origin` field while the flag is on.

Cached manifests can be tens of megabytes, so they are not read on every request. The first visit starts a background pass that reads each cached manifest once, one at a time, and keeps a small summary in memory (about 1 KB per package, at most 50,000 entries). Pages are then served from those summaries. A summary is refreshed as soon as this process rewrites the manifest, and after an hour at the latest, which covers other instances writing to the same storage.

The flag is off by default. Storage plugins that do not implement `search` show no cached packages. The toolbar search and scope filter only cover the cached pages loaded so far.
