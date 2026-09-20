---
name: testing-changes
description: Select and run the checks that cover a change on the verdaccio 6.x branch — the root vitest suite by area, lint and format, the built binary, the CLI e2e battery and the Cypress UI suite when the change is client- or UI-visible — and recognise when a change cannot be tested here because it lives in a published @verdaccio/* module. Use whenever verifying a change before committing or pushing, or when deciding what to run after an edit.
---

# Testing a change (6.x)

Run what the change affects. CI builds on Node.js 22, 24 and 26, lints, and runs
the CLI e2e matrix and the Cypress suite in their own workflows, so the local job
is fast, honest feedback. **There are no git hooks on this branch**: nothing runs
unless you run it.

## First: is the code even in this branch?

`src/` is the only source here. Everything under `@verdaccio/*` is a published
package from branch `8.x` (or `master` for the UI theme). If the bug you are
fixing is in `node_modules/@verdaccio/...`, no test on this branch can prove the
fix: it is made and tested on `8.x`, whose `pnpm verdaccio` builds a 6.x Docker
image with the local packages, and then bumped here.

## Selecting the run

```bash
yarn test                                                   # the whole suite
yarn test test/unit/modules/api                             # one area
yarn test test/unit/modules/api/publish.spec.ts             # one file
yarn test test/unit/modules/api/publish.spec.ts -t 'name'   # one case
```

The `test` script sets `NODE_ENV=test` and `TZ=UTC`; run it through `yarn test`,
not bare `vitest`, or date and environment-dependent tests change behaviour.

| Change touches                                        | Run                                                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/api/endpoint` (registry API)                     | `test/unit/modules/api`, then the CLI e2e battery for the affected client flow           |
| `src/api/web` (web endpoints, HTML)                   | `test/unit/modules/web`, then `yarn e2e:ui:local`                                        |
| `src/lib/storage.ts`, `local-storage.ts`, metadata    | `test/unit/modules/storage`, `api`, then e2e for publish/install/tarballs                |
| `src/lib/up-storage.ts`, `uplink-util.ts`             | `test/unit/modules/uplinks` (nock-mocked uplinks), `storage`, then e2e with an uplink    |
| `src/lib/auth-utils.ts`, `src/api/middleware.ts`      | `test/unit/modules/auth`, `access`, `api`, then e2e for login and publish                |
| `src/lib/config.ts`, `cli`, `bootstrap`, `run-server` | `test/unit/modules/config`, `cli`, `bootstrap`, then start the binary with a real config |
| Plugin loading (`test/unit/modules/plugin`)           | that suite plus a start with a real plugin configured                                    |

Always finish with `yarn lint`, `yarn format:check` and `yarn type-check`; CI
fails on any of them.

## Build and end-to-end

`bin/verdaccio` runs `build/`, so `yarn build` before anything that starts the
binary. The CLI battery is `@verdaccio/e2e-cli` (repository `verdaccio/e2e-tests`,
branch `main`), invoked the way `.github/workflows/e2e-cli.yml` does:

```bash
yarn build
mkdir -p /tmp/verdaccio-e2e
./node_modules/.bin/verdaccio-e2e --print-config --uplink-port 4874 > /tmp/verdaccio-e2e/config.yaml
node bin/verdaccio --config /tmp/verdaccio-e2e/config.yaml --listen 4873 &
yarn verdaccio-e2e --registry http://localhost:4873 --pm npm@11 --uplink-port 4874 -v
```

CI runs npm 10–12, pnpm 10–11 and yarn modern 4; run at least the client the
reporter used and `npm@11` when a change touches publish, install, tarballs,
dist-tags, search or auth. The UI suite is Cypress: `yarn e2e:ui:local`
(headless) or `yarn e2e:ui:local:open`. `yarn docker` builds
`verdaccio/verdaccio:local` for a container run (needs a running daemon).

## Gotchas that make a run lie

- **Network is blocked.** `vitest.setup.mjs` disallows every host except
  localhost via `nock`. `Nock: Disallowed net connect` means the code under test
  reached the network; mock the uplink, do not widen the allow-list.
- **A stale build.** The binary and the e2e battery run `build/`; after editing
  `src/`, rebuild or you test the previous code.
- **A port left behind.** A killed run can leave a registry on port 4873 (check
  with `lsof -i :4873`); the next run then tests the wrong process.
- **Global package-manager settings.** A user-level registry override or
  release-age setting changes what the e2e clients do; a failure that only
  happens on your machine usually comes from `~/.npmrc`.
- **The `packages/` leftover.** If a checkout carries an untracked `packages/`
  folder, nothing in it is tested or built here; ignore it.

## Reporting

Name what you ran and what you did not. "Ran `test/unit/modules/api` and
`storage` plus the e2e battery with `npm@11`; did not run the UI suite" is an
honest report. "Tests pass" after one area's run is not.
