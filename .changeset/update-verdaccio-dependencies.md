---
'verdaccio': patch
---

Update the bundled `@verdaccio/*` modules to their latest releases, which forward the new web UI options to the UI and fix a denial-of-service in request body parsing.

The web UI options `web.footer`, `web.poweredBy`, `web.help` and `web.showPackageListToolbar` now reach the UI (`@verdaccio/ui-theme` `9.0.0-next-9.39`); before this update the server dropped them. `showPackageListToolbar` defaults to `false`, so the home page looks the same after upgrading unless you turn it on, and `bun` is now listed among the default package managers shown on a package page.

`body-parser` moves to `1.20.9`, fixing a denial of service where trailing bytes after a compressed request body could tie up the server (GHSA-27r3-jxmh-p828). All 6.x releases that use `express` 4.22.3 are affected; no configuration change is needed.
