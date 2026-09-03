---
'@verdaccio/web': patch
'@verdaccio/ui-components': patch
---

Requesting a package version that does not exist (`/v/9.9.9`, or a dist-tag in the version slot) silently served the readme and sidebar of `latest` under the requested version's title; the endpoints now answer 404 so the UI shows Not Found. The UI also encodes the package name and `?v=` query (semver build metadata like `1.0.0+build.5` was decoded as a space and fell back to latest data). A manifest without a resolvable `dist-tags.latest` no longer crashes the sidebar endpoint into a 404 for a package that exists.
