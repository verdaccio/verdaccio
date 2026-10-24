---
'@verdaccio/ui-components': minor
'@verdaccio/ui-theme': minor
'@verdaccio/types': patch
'@verdaccio/middleware': minor
'@verdaccio/config': patch
'@verdaccio/web': minor
---

Guide new registries to their first publish, filter and sort the package list on the web UI home page, and link to each package tab directly.

The welcome card shown while the registry has no packages is now a step-by-step guide: point the package manager to the registry (with a tab for each manager listed in `web.pkgManagers`, plus the `.npmrc` line, honouring `web.scope`), create a user or log in (only when the web login is enabled), and publish. The page checks for new packages every ten seconds while the registry is empty, so the first published package appears without a reload. The same guide stays available once the registry has packages, in a new "Publishing" tab of the settings dialog (it shows `web.help` instead when that is set). The card also explains that packages installed through the registry from its uplinks are cached but not listed on this page, which only shows packages published to the registry. Copy buttons across the UI now confirm the copy with a check mark.

When the registry holds more than one package, the home page shows a toolbar above the list. A text filter matches the package name, description and keywords; a scope selector appears when the registry holds packages from more than one scope; and the list can be sorted by name or by most recent publication, besides the default order set by `web.sort_packages`. The filter and the scope are kept in the address (`?q=` and `?scope=`), so going back from a package restores them, and the chosen sort is remembered in the browser. When nothing matches, the page says so instead of showing the onboarding help for an empty registry. Operators who prefer the plain list can hide the toolbar with `web.showPackageListToolbar: false`; the list then keeps the server order. The version shown for each package links to the page of that version.

Search suggestions now show each result on two lines, name and version above the description. With `web.showUplinks` enabled they are grouped into packages published on this registry, packages cached from uplinks and packages only available from uplinks, each group with an icon and a count; with it disabled the list stays flat. The origin icons replace the former chips, which were announced as removable.

The tabs of the package page (readme, dependencies, versions, uplinks) are now part of the address as `?tab=versions`, so a link opens the tab it points to and the back button returns to the previous one. Opening another package starts again on the readme.

While the package list or a package page loads, the UI shows placeholders with the shape of the content instead of a full-page spinner. On phones, the version filter of the versions tab now takes the full width instead of half of it.

The UI now also gives instructions for `bun`, which joins the default `web.pkgManagers` list (`yarn`, `pnpm`, `npm`, `bun`); registries that set `pkgManagers` explicitly keep their own list. With it, the installation box shows `bun add`, the welcome card adds a `bunfig.toml` setup tab and the `bun publish --registry` command, and the registry information dialog gets a bun section. Below the commands, the box shows the `.npmrc` line that points the package at this registry, scoped (`@scope:registry=...`) for scoped packages.

The footer can now carry the operator's own content. Set `web.footer` to a markdown string, for example `footer: 'Need help? Read the [registry guide](https://verdaccio.org/docs/cli-registry)'`, and it replaces the default "Made with ♥" message; text, links and images are supported, and images stored in `web.assetFolder` are served under `/-/assets/`. The "Powered by" link on the right can be hidden with `web.poweredBy: false` or replaced with markdown in `web.poweredBy`, with the same support for text, links and images. Links open in a new tab and raw HTML in the markdown is not rendered.

The welcome card can be replaced with the operator's own markdown through `web.help`, for example onboarding instructions specific to the company. `{{registryUrl}}` in the text is replaced with the address of the registry; links open in a new tab and raw HTML is not rendered. A blank value keeps the default guide.

`web.showSearch: false` now also disables the web search endpoint (`/-/verdaccio/data/search`), which answers 404, besides hiding the search box in the header. The npm search API used by `npm search` is not affected.

The registry information dialog gains a "Minimum release age" section. For each configured package manager it shows the setting that skips versions published in the last three days, in the file and unit that client reads (`min-release-age` in `.npmrc`, `minimumReleaseAge` in minutes in `pnpm-workspace.yaml`, `npmMinimalAgeGate` in `.yarnrc.yml`, `minimumReleaseAge` in seconds in `bunfig.toml`), with the registry's `web.scope` exempt where the client allows it, so its own packages install right away: npm and pnpm exclude the scope, yarn gets a per-scope gate under `npmScopes`, and bun, which only exempts exact package names, gets a note saying so. It also points registry operators to the package filter's `minAgeDays`.
