---
'@verdaccio/core': patch
'@verdaccio/utils': patch
---

fix: upgrade minimatch to 10.2.5 to resolve brace-expansion DoS advisories

minimatch 7.4.9 depends on brace-expansion ^2.0.2, a range that has no patch
for GHSA-mh99-v99m-4gvg (unbounded expansion length causing an out-of-memory
crash, high severity) and resolved to a version also affected by
GHSA-3jxr-9vmj-r5cp (exponential-time expansion of consecutive non-expanding
`{}` groups, high severity). Only brace-expansion >=5.0.8 fixes both, so
downstream consumers cannot heal through their own installs while minimatch 7
is in the dependency tree. minimatch 10.2.5 depends on brace-expansion ^5.0.5
and both packages already use the v9+ named-export API, so this is a drop-in
upgrade.
