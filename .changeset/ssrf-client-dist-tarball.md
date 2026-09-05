---
'@verdaccio/store': patch
---

fix: do not fetch client-controlled dist.tarball urls off-uplink

A locally published package stores its `versions[].dist.tarball` verbatim. When the
tarball file was later removed, a tarball request fell back to that url and the registry
fetched it — an SSRF that also attached the uplink `Authorization` header when a single
uplink was configured. Off-uplink urls are now only fetched for uplink-synced packages
(recorded in `_distfiles`), and the uplink credential is only sent to a host the uplink
actually serves.
