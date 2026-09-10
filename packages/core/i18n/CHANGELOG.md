# @verdaccio/ui-i18n

## 10.0.0-next-9.5

### Patch Changes

- 8b2b136: Web UI bug batch:
  
  - the create-user form posted to a non-existent endpoint, so web signup always failed; it now calls `PUT /-/verdaccio/sec/signup` with the required `sessionId` and logs the new user in
  - 5xx/network failures rendered a blank detail page whose tabs crashed the whole app, and an unreachable backend looked like an empty registry inviting to publish; both now show a proper error state
  - the router used the raw `url_prefix` as basename, leaving the UI blank or 404ing behind proxies and `VERDACCIO_PUBLIC_URL`; it now uses the server-normalized basename, and the security pages' links/redirects respect sub-path deployments
  - the whole `security.*` i18n namespace was missing from the shipped bundle (raw keys on the login, add-user and change-password pages); both crowdin sources are now synced and kept aligned by a parity test, and dates follow the selected language
  - requesting a version that does not exist (`/v/9.9.9`, a dist-tag, or `__proto__`) silently served `latest` under the requested title; the sidebar and readme endpoints now answer 404, with own-property version lookups that also close a prototype-pollution path flagged by CodeQL
  - login/search/download failures were swallowed or all mapped to "invalid username or password"; errors are now surfaced and translated, submits are reentrancy-guarded against duplicate requests, and a 2xx login response without a token no longer passes as a login
  - logging out re-hydrated the session from storage before clearing it, expired tokens lingered in localStorage for up to an hour, and malformed tokens were printed to the console
  - assorted fixes: `yarn global add -g true`, clipboard on plain-http deployments, versions tab showing the previous package's data, missing gravatars, corrupted staged tarball downloads, string forms of `repository`/`funding`/`bugs`, developers without email collapsing into one, stray "0"s and "Invalid Date" tooltips, empty keywords section, nested `<form>` markup, a11y labels and the vendor notice in the browser console

## 10.0.0-next-9.4

### Patch Changes

- 47f122f: chore(deps): clean-up unused and duplicates

## 10.0.0-next-9.3

### Patch Changes

- 6408a85: chore: force release

## 10.0.0-next-9.2

### Major Changes

- 52a6520: Replace Babel and esbuild build pipeline with Vite 8 across all packages. All packages now output dual ESM (.mjs) and CJS (.js) formats with TypeScript declarations generated via vite-plugin-dts. Includes shared build config at vite.lib.config.mjs, proper exports field in all package.json files, and fixes for type-only re-exports required by Rollup's stricter module analysis.

## 10.0.0-next-9.1

### Major Changes

- 325c584: feat: migrate to vite

## 10.0.0-next-9.0

### Major Changes

- 7f80af5: chore: bump package

## 8.0.0-next-8.14

### Minor Changes

- b5eccfc: feat: remove rematch refactor ui

## 8.0.0-next-8.13

### Patch Changes

- 626ae6a: feat: web v1 login frontend (experimental)

## 8.0.0-next-8.12

### Patch Changes

- e4a1539: chore: package.json maintenance
- dbe6a76: fix(i18n): avoid fallback for en-us

## 8.0.0-next-8.11

### Patch Changes

- b6e9f46: fix: ignore duplicted files
