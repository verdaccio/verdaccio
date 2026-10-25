---
'verdaccio': patch
---

Show the `verdaccio` package version in the web UI footer instead of the internal module version.

`verdaccio@7.0.0` (and the `verdaccio/verdaccio:7` Docker image) displayed `9.0.0-next-9.40` in the bottom-right corner of the web UI. The 7 binary is a thin layer over the published `@verdaccio/*` 9.x modules, and `@verdaccio/server` filled the version shown by the UI from its own package while the command line and the startup log already reported the right one.

This release updates the `@verdaccio/*` modules to `9.0.0-next-9.41`, whose `@verdaccio/server` lets the embedding binary set that value, and passes the `verdaccio` package version to it, so the UI now shows the same version as `verdaccio --version`. No configuration change is needed.
