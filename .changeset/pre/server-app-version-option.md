---
'@verdaccio/server': minor
---

Let the binary that embeds `@verdaccio/server` set the version the web UI displays.

The web UI footer and the `ui-options.js` payload took their `version` from the `@verdaccio/server` package itself. A distribution built on top of the 9.x modules, such as the `verdaccio` 7 package, reports its own version on the command line and in the startup log but the UI still showed the internal module version: `verdaccio@7.0.0` (and the `verdaccio/verdaccio:7` Docker image) displayed `9.0.0-next-9.40` in the bottom-right corner.

`defineAPI(config, storage, options)` now accepts an optional `version` that overrides the value shown by the UI. When it is omitted the behaviour is unchanged and the `@verdaccio/server` version is used, so the `verdaccio` 9.x binary is not affected. The 7.x line passes its own package version once it picks up this release.
