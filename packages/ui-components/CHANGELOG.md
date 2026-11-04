# @verdaccio/ui-components

## 5.0.0-next-9.27

### Patch Changes

- 7769814: chore(ui-components): sort dependencies
  
  Sort dependency tags alphabetically by name in the dependency blocks. Dependency blocks previously showed tags in source order. They now sort tags by package name. No configuration change is required.

## 5.0.0-next-9.26

### Patch Changes

- e2cb9d7: Show the bun publish command and the bun login note in the web UI help guide only while the bun tab is selected.
  
  The help guide listed `bun publish --registry <url>` and the note about bun having no login command whenever `bun` was in `web.pkgManagers`, which it is by default, so npm, pnpm and yarn users saw bun instructions too. Both now follow the client chosen in the first step: the bun tab shows `bun publish`, every other tab shows `npm publish`. Removing `bun` from `web.pkgManagers` still hides the bun tab entirely.
- 9d16db0: Show the note about uplink packages only on the home page help card, not in the settings dialog.
  
  The note explaining that packages fetched from uplinks such as npmjs are cached but not listed, with its "How uplinks work" link, is about the empty package list on the home page. It was also shown under the publishing guide in the settings dialog, where there is no list to explain. It now appears only on the home page help card.
- 6532105: Suggest Verdaccio's yarn-plugin-npm in the web UI help guide when the yarn tab is selected.
  
  The "Create a user or log in" step only offered `npm adduser`, so Yarn users had to switch to npm to get a token. With the yarn tab selected, the step now also shows how to install the plugin (`yarn dlx @verdaccio/yarn-import npm-login`) and log in with `yarn npm login --registry <url>`, which can create the user on the registry and stores the token in `~/.yarnrc.yml`, plus a link to https://github.com/verdaccio/yarn-plugin-npm. Other tabs are unchanged.
- 601dd79: Make links inside the web UI's markdown text readable in dark mode.
  
  Text rendered from markdown, such as the package filter link under the minimum release age settings, the package manager notes and the translation contribution text in the settings dialog, used plain browser links whose default dark blue was nearly invisible on the dark theme. These links now use the theme's link style, the same as the documentation link in the dialog footer, in both light and dark mode. The custom footer, powered-by text and `web.help` markdown get the same styling, and every markdown link opens in a new tab.
- 3b79553: Add bottom spacing to the settings dialog tabs so their last item no longer touches the dialog footer.
  
  In the publishing tab the last command box sat flush against the footer with the documentation link and close button, and looked cut off. Every tab of the settings dialog now has the same space below its content as above it.

## 5.0.0-next-9.25

### Minor Changes

- eb0cb3d: Guide new registries to their first publish, filter and sort the package list on the web UI home page, and link to each package tab directly.
  
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

## 5.0.0-next-9.24

### Patch Changes

- d8ff951: Show how much of each language is translated in the web UI settings, and translate the UI from a single Crowdin source file.
  
  The Translations tab of the settings dialog now shows the translated percentage of every language on smaller, keyboard-accessible cards, and links to a short guide on how to contribute translations or request a new language. Crowdin now exports only translated strings, so untranslated keys keep falling back to English while the percentage reflects real progress.
  
  The UI strings were uploaded to Crowdin twice, once from `@verdaccio/ui-i18n` and once from a copy inside `@verdaccio/ui-theme`, and the two copies had already drifted apart once. The strings and the downloaded translations now live in `@verdaccio/ui-components`, next to the components that render them, which also exports `loadTranslationFile()` and bundles every downloaded language at build time. `@verdaccio/ui-theme` uses that loader instead of its own copy, and the translations link in the default configuration files points to the new guide.
  
  `@verdaccio/ui-i18n` is no longer released from this line. Its published loader only ever returned English for builds, because the downloaded translations were never part of its package; use `loadTranslationFile` from `@verdaccio/ui-components` instead. No configuration changes are required.
- 52d92de: Offer the web UI languages that are actually translated.
  
  Korean, Polish and Galician are now available in the language selector, as each has more than 20% of the UI translated on Crowdin. Japanese, Ukrainian and Khmer are removed because no translations exist for them, so selecting them only showed English. Dates now also follow the selected language for Irish, Italian, Korean, Polish and Galician. More languages can be requested from the translation guide linked in the settings dialog.

## 5.0.0-next-9.23

### Patch Changes

- 4a483d0: Move the Change Password option from the login form to the signed-in user's account menu.
  
  When `flags.changePassword` is enabled, users can now open the password change form from their account menu. Previously, the link appeared in the login form even though changing a password requires an authenticated session. The option remains hidden when the feature is disabled.
  
  Opening the password change URL without a session now displays a sign-in dialog explaining that authentication is required. Successful sign-in returns users to the form at the same URL. If the server rejects an expired session, the form is cleared and sign-in is requested again.
  
  The password change form no longer asks for a username. The authenticated session determines which account is updated; users enter only their current password, new password and confirmation.
  
  An incorrect current password submitted through the web form (`PUT /-/verdaccio/sec/reset_password`) now returns HTTP 400 with `invalid old password` when using the bundled htpasswd or auth-memory plugin. Previously it returned a generic HTTP 500. The form displays a translated field error and keeps the session open so the user can correct the password. Unexpected plugin and storage failures on that endpoint still return a generic HTTP 500.
  
  `npm profile set password` (`POST /-/npm/v1/user`) still returns HTTP 403 for an incorrect current password, as do plugin and storage failures on that endpoint, but the message is now `invalid old password` instead of `Unable to change password for user '<name>': invalid old password`.
- 8a6e1a1: Update runtime dependencies across the registry and run the official Docker image on Node.js 26.
  
  The Docker image now builds and runs on `node:26-alpine`, the Node.js line that becomes Active LTS on 28 October 2026; Node.js 24 entered maintenance on 20 October. Operators who extend the image should check that any native addons they install support Node.js 26.
  
  The uplink, notification and audit HTTP client moves to `got` 16. Verdaccio does not use the options removed in that release (the HTTP/2 agent slot, `dnsCache` and the old `auth` stubs), so uplink configuration, `agent_options` and `https_proxy` behave as before. Uplink responses with an error status, such as a 404 for a package the uplink does not have, keep appearing in the `http` log as they did with `got` 15. The CLI moves to `chalk` 6 and the web UI's README renderer to `marked` 18.
  
  The remaining updates are minor or patch releases: `express` 5.3.0 in every package that serves HTTP, `express-rate-limit` 8.7.1, `pino` 10.4.0, `js-yaml` 5.5.0, `tar-stream` 3.2.2, `sanitize-filename` 1.6.4, `process-warning` 5.1.1 and `memfs` 4.80.0. No configuration changes are required.
- Updated dependencies [4a483d0]
  - @verdaccio/ui-i18n@10.0.0-next-9.6

## 5.0.0-next-9.22

### Patch Changes

- 2e494bb: fix(ui-components): imports for vitest, apiroute
- f3f8976: chore: replace \_\_dirname with import.meta.dirname

## 5.0.0-next-9.21

### Patch Changes

- 770ebe4: fix(ui): follow-ups to the web UI bug batch
  
  - login and signup now update the auth context, so the header reflects the session immediately instead of showing the login button until a manual refresh
  - a 2xx login/signup response without a token shows an error instead of a false success page
  - a readme-only failure no longer blanks the whole package detail page, and a failed revalidation no longer hides the cached package list on the home page
  - the versions filter resets when navigating to another package instead of silently applying the previous package's filter
  - the search dropdown shows the loading state during the debounce window instead of flashing "No results found" on every keystroke
  - the session now logs out exactly when the token expires (single timer) instead of polling every minute and hard-reloading mid-interaction
  - a malformed leading `funding` entry no longer hides a later valid funding url
- 8b2b136: Web UI bug batch:
  
  - the create-user form posted to a non-existent endpoint, so web signup always failed; it now calls `PUT /-/verdaccio/sec/signup` with the required `sessionId` and logs the new user in
  - 5xx/network failures rendered a blank detail page whose tabs crashed the whole app, and an unreachable backend looked like an empty registry inviting to publish; both now show a proper error state
  - the router used the raw `url_prefix` as basename, leaving the UI blank or 404ing behind proxies and `VERDACCIO_PUBLIC_URL`; it now uses the server-normalized basename, and the security pages' links/redirects respect sub-path deployments
  - the whole `security.*` i18n namespace was missing from the shipped bundle (raw keys on the login, add-user and change-password pages); both crowdin sources are now synced and kept aligned by a parity test, and dates follow the selected language
  - requesting a version that does not exist (`/v/9.9.9`, a dist-tag, or `__proto__`) silently served `latest` under the requested title; the sidebar and readme endpoints now answer 404, with own-property version lookups that also close a prototype-pollution path flagged by CodeQL
  - login/search/download failures were swallowed or all mapped to "invalid username or password"; errors are now surfaced and translated, submits are reentrancy-guarded against duplicate requests, and a 2xx login response without a token no longer passes as a login
  - logging out re-hydrated the session from storage before clearing it, expired tokens lingered in localStorage for up to an hour, and malformed tokens were printed to the console
  - assorted fixes: `yarn global add -g true`, clipboard on plain-http deployments, versions tab showing the previous package's data, missing gravatars, corrupted staged tarball downloads, string forms of `repository`/`funding`/`bugs`, developers without email collapsing into one, stray "0"s and "Invalid Date" tooltips, empty keywords section, nested `<form>` markup, a11y labels and the vendor notice in the browser console
- 770ebe4: fix(ui): drop `credentials: 'include'` from the tarball download fetch. Web-UI auth travels in the `Authorization: Bearer` header, not cookies, so `include` gained nothing but made the browser reject the registry's wildcard `Access-Control-Allow-Origin: *` on cross-origin downloads (e.g. `pnpm start`, where the UI dev server on :4873 fetches tarballs from the registry on :8000), breaking the download-tarball button with a CORS error.
- Updated dependencies [8b2b136]
  - @verdaccio/ui-i18n@10.0.0-next-9.5

## 5.0.0-next-9.20

### Minor Changes

- 30601b3: feat: staged publishing (`npm stage`) behind the `stage` flag

  Adds the `/-/stage` endpoints so a package version can be uploaded for review and
  only becomes installable once a maintainer approves it. Everything is gated by
  the new `stage` feature flag, which defaults to `false`.

  ```yaml
  flags:
    stage: true
  ```

  The whole `npm stage` family is supported — `publish`, `list`, `view`,
  `download`, `approve` and `reject` — verified end to end against npm 11.17.
  Staging never asks for a one-time password: deferring proof of presence to
  approval time is the point of the flow, which lets a pipeline prepare a release
  that a human approves later.

  Package access gains a `stage` entry deciding who may submit a version for
  review:

  ```yaml
  packages:
    "my-company-*":
      access: $authenticated
      stage: developers
      publish: release-managers
  ```

  It falls back to `publish` when omitted, exactly as `unpublish` already does, so
  existing configurations are unaffected. Granting it to a group that lacks
  `publish` is what turns review into a real gate: those users can propose a
  release but neither publish one directly nor approve their own submission, though
  they can always withdraw it. Auth plugins can implement `allow_stage`; returning
  `undefined` defers to `allow_publish`.

  Staging fires a notification with `publishType: 'stage'` and rejecting fires
  `unstage`, so a staged version no longer waits unnoticed until somebody runs
  `npm stage list`. Approving keeps reporting `publish`, because that is what it
  does.

  Staged items are persisted through the storage plugin interface, so any storage
  plugin works unchanged, and the namespace is never registered in the plugin
  database — staged versions stay out of search and the package list.

  The web UI gains a "Staged packages" view (list, detail, approve, reject,
  download) that appears only while the flag is on.

## 5.0.0-next-9.19

### Patch Changes

- dd4f91c: Annotate the `useLoginForm` return type so declaration emit no longer fails

  The inferred return type referenced `react-hook-form`'s internal `FormState`,
  which `tsc --emitDeclarationOnly` could not name portably (TS2883). Declaring the
  return as `UseFormReturn<LoginFormValues> & { onSubmit }` fixes the build.

## 5.0.0-next-9.18

### Patch Changes

- 60d8e97: fix(ui-components): lint and test warnings

## 5.0.0-next-9.17

### Patch Changes

- 9463808: fix(ui): keep the homepage action icon legible on hover

## 5.0.0-next-9.16

### Patch Changes

- 6a87488: Fix type resolution for the TypeScript 7 upgrade: switch the UI packages to `moduleResolution: bundler` (required to resolve react-router 8 types via its `exports` map), declare `@mui/system` as a direct dependency so emitted declarations can reference its types portably, and replace the legacy `@mui/material/styles/createTheme` module augmentation with the `@mui/material/styles` entry point.

  Declaration files are now emitted with the TypeScript compiler itself (`tsc --emitDeclarationOnly`) instead of `vite-plugin-dts`, which has no JS compiler API to hook into on TypeScript 7. This drops the `@typescript/typescript6` fallback install (and with it a duplicated i18next instance that left the settings dialog's language list empty). `runCli()` in `@verdaccio/cli` is now correctly typed as `Promise<void>` — the previous `Promise<number>` annotation was wrong and only survived because the old declaration generator ignored type errors.

  The Cypress e2e specs are now bundled with Vite (the default webpack/ts-loader preprocessor requires the TypeScript JS compiler API, which TypeScript 7 no longer ships).

## 5.0.0-next-9.15

### Patch Changes

- 47f122f: chore(deps): clean-up unused and duplicates
- Updated dependencies [47f122f]
  - @verdaccio/ui-i18n@10.0.0-next-9.4

## 5.0.0-next-9.14

### Patch Changes

- 6408a85: chore: force release
- Updated dependencies [6408a85]
  - @verdaccio/ui-i18n@10.0.0-next-9.3

## 5.0.0-next-9.13

### Patch Changes

- cb359b9: chore: force release

## 5.0.0-next-9.12

### Patch Changes

- cdf3150: fix: refactor unit test

## 5.0.0-next-9.11

### Patch Changes

- 8793f4c: chore(ui-components): remove **partials** from build
- 5e64d64: chore(ui-components): update json-viewer
- 19471c8: chore(ui): pin vite and remove eslint plugin deps

## 5.0.0-next-9.10

### Patch Changes

- 446346b: fix: save auth token synchronously before navigation on login to ensure package list refreshes with authenticated access

  Disable SWR revalidateOnFocus and revalidateOnReconnect to prevent unnecessary repeated API calls

  Closes #5813

## 5.0.0-next-9.9

### Patch Changes

- e8292fb: fix(ui-components): search tests
- 2512f09: chore(ui-components): stderr during tests
- f19a638: chore: fix vite build warnings and errors

## 5.0.0-next-9.8

### Minor Changes

- 747d6ab: feat: auto-detect search response shape in the Web UI and remove the `searchRemote` flag

  ## Breaking Changes

  ### Removed the `searchRemote` feature flag

  The `flags.searchRemote` configuration option has been removed. The Web UI now
  auto-detects the shape of the `/-/verdaccio/data/search/*` response at render
  time, so no flag is required to toggle between local-only and remote-augmented
  results.

  **What changed:**

  - `FlagsConfig.searchRemote` has been removed from `@verdaccio/types`.
  - `@verdaccio/config` no longer reads or defaults `flags.searchRemote`.
  - The sample `# searchRemote: true` lines in `default.yaml` / `docker.yaml`
    have been removed.
  - The search UI (`@verdaccio/ui-components`) no longer consults the flag.

  **Migration guide:**

  Remove `flags.searchRemote` from your `config.yaml` if it is set. No other
  change is required — the Web UI will render both response shapes transparently.

  ## UI changes

  The `Search` component now consumes two response shapes without configuration:

  1. **npm-style "search objects"** — entries wrapped in a `package` envelope
     with `verdaccioPkgCached` / `verdaccioPrivate` metadata. Private / cached /
     remote chips are rendered as before.
  2. **Flat packument-style** — entries with `name`, `version`, `description`,
     `dist`, etc. at the top level. Chips are omitted because the shape carries
     no uplink metadata.

  A new `normalizeSearchOption()` helper centralizes the shape detection and is
  covered by unit tests. The `SearchResultWeb` type in `@verdaccio/types` is now
  a union (`SearchResultWebFlat | SearchResultWebWrapped`) that documents both
  shapes.

## 5.0.0-next-9.7

### Patch Changes

- d68a86d: refactor: migrate from lodash to lodash-es and replace simple utilities with native JS

## 5.0.0-next-9.6

### Patch Changes

- 70b30df: chore(ui-components): replace jsx with react.jsx

## 5.0.0-next-9.5

### Patch Changes

- aeb0ae6: chore(ui-components): simplify test server setup
- 80ddcda: chore(ui): remove babel dependency
- b4cac24: chore(ui-components): fix flaky tests, msw
- 9d5360b: chore: vite replace rollupOptions with rolldownOptions

## 5.0.0-next-9.4

### Patch Changes

- 8f9bcc8: fix: links to doc
- ed4c844: fix(ui-components): json viewer
- fd09d4f: chore: update vitest to 4.1.0 and @vitest/coverage-v8 to 4.1.0

## 5.0.0-next-9.3

### Major Changes

- 52a6520: Replace Babel and esbuild build pipeline with Vite 8 across all packages. All packages now output dual ESM (.mjs) and CJS (.js) formats with TypeScript declarations generated via vite-plugin-dts. Includes shared build config at vite.lib.config.mjs, proper exports field in all package.json files, and fixes for type-only re-exports required by Rollup's stricter module analysis.

### Patch Changes

- f32524b: fix: search component improvements

  - fix: extract search query from URL path instead of query params to match API routing
  - fix: decode URI components in search query (e.g. `%40` to `@`) for scoped packages
  - fix: resolve undefined package name on search result click when `searchRemote` is disabled
  - feat: display "No results found" message when search yields no matches
  - feat: make detail page tabs full-width on desktop and scrollable on mobile
  - test: add unit tests for AutoComplete component
  - test: update Search tests to cover debounce memoization and cleanup on unmount

- Updated dependencies [52a6520]
  - @verdaccio/ui-i18n@10.0.0-next-9.2

## 5.0.0-next-9.2

### Major Changes

- 325c584: feat: migrate to vite

### Patch Changes

- Updated dependencies [325c584]
  - @verdaccio/ui-i18n@10.0.0-next-9.1

## 5.0.0-next-9.1

### Major Changes

- dd9bad3: feat: upgrade to express v5

## 5.0.0-next-9.0

### Major Changes

- 7f80af5: chore: bump package

### Patch Changes

- Updated dependencies [7f80af5]
  - @verdaccio/ui-i18n@10.0.0-next-9.0

## 4.0.0-next-8.13

### Minor Changes

- b5eccfc: feat: remove rematch refactor ui

### Patch Changes

- Updated dependencies [b5eccfc]
  - @verdaccio/ui-i18n@8.0.0-next-8.14

## 4.0.0-next-8.12

### Patch Changes

- b24f513: chore(lint): switch rules from jest to vitest
- 6d1a84a: chore(deps): node-api, fastify, ui-comp, web
- 05c8e51: fix(ui): regression after mui 7 upgrade

## 4.0.0-next-8.11

### Patch Changes

- f443f81: chore(deps): sync and pin dependencies

## 4.0.0-next-8.10

### Patch Changes

- 07a0ecb: chore(ui): update deps and storybook

## 4.0.0-next-8.9

### Minor Changes

- 626ae6a: feat: web v1 login frontend (experimental)

### Patch Changes

- 387d9f0: fix(ui): check token expiry on refresh/timer
- 72c3cbb: chore(utils): replace @verdaccio/utils dependency with core
- 4236e54: chore(ui): avoid ts error for Alerts
- 89b72d0: fix(ui): search chips when showUplinks is false
- ca0844a: chore(ui): avoid ts errors for CircularProgress
- 6561485: chore(ui): fix ts error due to excluded test folder
- Updated dependencies [626ae6a]
  - @verdaccio/ui-i18n@8.0.0-next-8.13

## 4.0.0-next-8.8

### Patch Changes

- 2bcd3ca: chore(config): harmonize configuration options
- 209a650: chore: fix ui-component npmignore and readme

## 4.0.0-next-8.7

### Patch Changes

- ef6864c: chore(deps): update webpack-dev-server to v5
- 3763df1: fix(ui): start storybook on windows
- c81bd75: chore(ui): update react-json-view
- 99f6e11: chore(ui): flags import and minor updates
- e4a1539: chore: package.json maintenance
- 4933663: fix(ui): format date distance test
- 0607e80: chore: update readme badges and license files
- c1faf6d: chore(ui): reduce build size
- Updated dependencies [e4a1539]
- Updated dependencies [dbe6a76]
  - @verdaccio/ui-i18n@8.0.0-next-8.12

## 4.0.0-next-8.6

### Patch Changes

- Updated dependencies [b6e9f46]
  - @verdaccio/ui-i18n@8.0.0-next-8.11

## 4.0.0-next-8.5

### Minor Changes

- 970e0c9: update hover background color of package list

### Patch Changes

- 69f2e66: fix(ui): sort versions
- eb4a24b: chore(deps): upgrade storybook to v8
- 8289cc6: fix: ui-component vitest api

## 4.0.0-next-8.4

### Minor Changes

- 5a91448: support packages with multiple module types

## 4.0.0-next-8.3

### Patch Changes

- 0225c80: chore(ui): vitest follow-ups
