---
'verdaccio': patch
---

Restore the `@verdaccio/package-filter` plugin in the `verdaccio` 7 package so the filter configuration works again.

Verdaccio 7.0.0 shipped a default `config.yaml` (also the one inside the `verdaccio/verdaccio:7` Docker image) with the `filters: '@verdaccio/package-filter'` section enabled, but the package no longer declared the plugin as a dependency: it was dropped when the 7.x line moved to the published `@verdaccio/*` modules. On startup the plugin loader logged `package not found, try to install @verdaccio/package-filter with a package manager` and continued without it, so any `minAgeDays`, `dateThreshold` or `block` rules configured under `filters` were silently not enforced.

The plugin is a dependency of `verdaccio` again, as it is on the 6.x line, and the startup error is gone. No configuration change is needed; installations that worked around the problem by commenting out the `filters` section can enable it again. Affected: `verdaccio@7.0.0` and the `verdaccio/verdaccio:7` Docker image.
