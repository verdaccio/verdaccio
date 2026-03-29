---
'@verdaccio/package-filter': minor
'@verdaccio/config': patch
---

feat: add package-filter plugin

Backport the package-filter plugin from next-9 to the 8.x branch. This plugin implements the ManifestFilter interface to control which package versions are visible to consumers, supporting block/allow rules by scope, package name, version range, publish date, and minimum age.
