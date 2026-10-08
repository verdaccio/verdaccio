---
'verdaccio': patch
---

Update the bundled Express dependencies to clear two advisories in the shipped dependency tree.

`proxy-addr` is forced to `>=2.0.8` (GHSA-jqcg-44mw-7w3h, IP spoofing via an IPv4-mapped IPv6 trust subnet) and `compression` to `>=1.8.2` (GHSA-vc2v-76pw-4v95, denial of service through a memory leak when a response closes prematurely). Both are reached transitively through Express; the fix is applied as a workspace override, so no configuration change is required when upgrading.
