---
'verdaccio': patch
---

fix: do not fetch client-controlled dist.tarball urls off-uplink

Only fetch a tarball url that a configured uplink actually serves. Off-uplink urls are
fetched without uplink credentials and only for uplink-synced packages (recorded in
`_distfiles`); a locally published package returns 404 instead of being fetched. Prevents
sending an uplink `Authorization` header to an unrelated host.
