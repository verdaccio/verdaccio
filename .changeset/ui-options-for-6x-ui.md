---
'@verdaccio/types': minor
'@verdaccio/middleware': minor
'@verdaccio/config': minor
---

Pass the new web UI options to the UI theme, so registries on 6.x can use them.

The web UI gained options that only work when the server forwards them to the browser. `@verdaccio/middleware` now forwards `web.footer` (markdown that replaces the footer message), `web.poweredBy` (`false` hides the "Powered by" link, markdown replaces it), `web.help` (markdown that replaces the welcome card of an empty registry, with `{{registryUrl}}` filled in) and `web.showPackageListToolbar` (the filter, scope and sort bar above the home page package list). On this line the toolbar stays off unless `showPackageListToolbar: true` is set, so the home page looks as before after an upgrade. `bun` joins the default `web.pkgManagers` list (`yarn`, `pnpm`, `npm`, `bun`); registries that set `pkgManagers` keep their own list.

The options take effect with a `@verdaccio/ui-theme` release that implements them. The default `config.yaml` documents them as comments; nothing changes for registries that do not set them.
