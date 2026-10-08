---
'@verdaccio/store': patch
---

Keep upstream package owners distinct from local accounts when `publish.check_owners` is enabled.

Proxied packages record the upstream maintainer list so the ownership check applies to them. Those names are now stored as origin-scoped identities (`$uplink:<uplink>:<name>`) and are not treated as local users, so a local account whose username matches an upstream maintainer cannot change the cached package. A name that already starts with `$uplink:` is left as-is and still does not grant ownership. Packages that already have a recorded maintainer list are left unchanged. Version metadata and search results keep the upstream display names.
