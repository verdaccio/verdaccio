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

Cached packages are loaded in pages of 50 while you scroll, from a new `GET /-/verdaccio/data/packages/cached?limit=&after=` endpoint (at most 100 per page). Pages are cut by cursor: `after` is the last package name of the previous page and the response carries the next cursor, or `null` on the last page. Package access rules and filter plugins apply as they do for the private list, and a request checks access for at most 1,000 names before answering, so a user allowed few packages never makes one request walk the whole index. The private list endpoint works as before and only adds an `origin` field while the flag is on.

Cached manifests can be tens of megabytes, so they are not read on every request. Whenever this process writes a cached manifest it keeps a small summary in memory (about 1 KB per package, at most 50,000 entries), and the list of cached names follows those writes too, so the steady state costs no extra disk reads. The first visit after a start also runs one paced background pass that reads each cached manifest once, so scrolling does not wait on disk; it is skipped when there are more packages than summaries kept. Only to cover other instances writing to the same storage, the name index is rescanned after five minutes and a summary is re-read after an hour, and only for the page being served.

The flag is off by default. Storage plugins that do not implement `search` show no cached packages. The toolbar search and scope filter only cover the cached pages loaded so far; while a filter is active the list stops loading pages on scroll and offers a "Load more packages" button instead.
