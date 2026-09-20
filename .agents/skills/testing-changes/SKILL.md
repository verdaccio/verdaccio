---
name: testing-changes
description: Select and run the checks that cover a change on the verdaccio 7.x branch — the root vitest suite by area, lint with zero warnings, format, the built binary, and the e2e battery from verdaccio/e2e-tests when the change is client-visible — and recognise when a change cannot be tested here because it lives in a published @verdaccio/* module. Use whenever verifying a change before committing or pushing, or when deciding what to run after an edit.
---

# Testing a change (7.x)

Run what the change affects. CI lints, builds and tests on Node.js 24 and 25 and
builds the Docker image; the CLI e2e battery for this line lives in the
`verdaccio/e2e-tests` repository (branch `7.x`) and is not part of this repo's
CI. **There are no active git hooks on this branch**: nothing runs unless you run
it.

## First: is the code even in this branch?

`src/` is the only source here. Everything under `@verdaccio/*` is a published
`9.0.0-next-9.x` package from `master`. If the bug you are fixing is in
`node_modules/@verdaccio/...`, no test on this branch can prove the fix: it is
made and tested on `master`, released as `next-9`, and bumped here. What this
branch owns is the wiring in `src/lib` (startup, config, auth and storage
composition, the legacy storage adapter) and its tests.

## Selecting the run

```bash
pnpm test                                                   # the whole suite
pnpm test test/unit/modules/storage                         # one area
pnpm test test/unit/modules/api/publish.spec.ts             # one file
pnpm test test/unit/modules/api/publish.spec.ts -t 'name'   # one case
```

The `test` script sets `NODE_ENV=test` and `TZ=UTC`; run it through `pnpm test`,
not bare `vitest`.

| Change touches                                 | Run                                                                                  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/lib/storage.ts`, `up-storage.ts`          | `test/unit/modules/storage`, `uplinks`, then the e2e battery for publish and install |
| `src/lib/legacy-storage-adapter.ts`            | `test/unit/modules/storage` and `plugin`, then a start with a legacy storage plugin  |
| `src/lib/auth.ts`, `auth-utils.ts`             | `test/unit/modules/auth`, `access`, then e2e for login and publish                   |
| `src/lib/config.ts`, `cli.ts`, `run-server.ts` | `test/unit/modules/config`, `cli`, `bootstrap`, then start the binary with a config  |
| `src/lib/logger`                               | the logger tests, then a start and a look at the output in both formats              |
| A `@verdaccio/*` dependency bump               | the whole suite, then the e2e battery: the bump is what changes behaviour            |

Always finish with `pnpm lint` (zero warnings allowed), `pnpm format:check` and
`pnpm type-check`; CI fails on any of them.

## Build and end-to-end

`bin/verdaccio` runs `build/`, so `pnpm build` before anything that starts the
binary (`pnpm start` runs the source through `tsx` instead). For a client run,
start the built binary and point the e2e battery at it from a checkout of
`verdaccio/e2e-tests` on branch `7.x`:

```bash
pnpm build
node bin/verdaccio --config <config.yaml> --listen 4873 &
# in the e2e-tests checkout (branch 7.x):
pnpm verdaccio-e2e --registry http://localhost:4873 --pm npm@11 -v
```

Run at least the client the reporter used and `npm@11` when a change touches
publish, install, tarballs, dist-tags, search or auth. `pnpm docker` builds
`verdaccio/verdaccio:local-7.x` for a container run (needs a running daemon).

## Gotchas that make a run lie

- **No network lockdown.** Unlike `6.x` and `master`, this branch's vitest setup
  does not block the network. A test that passes may have reached a real
  registry; mock uplinks with `nock` and check no real host is hit.
- **A stale build.** The binary and the e2e battery run `build/`; after editing
  `src/`, rebuild or you test the previous code.
- **A port left behind.** A killed run can leave a registry on port 4873 (check
  with `lsof -i :4873`).
- **Global package-manager settings.** A user-level registry override or
  release-age setting changes what `pnpm install` and the e2e clients do.
- **The `packages/` leftover.** If a checkout carries an untracked `packages/`
  folder, nothing in it is tested or built here; ignore it.

## Reporting

Name what you ran and what you did not. "Ran `test/unit/modules/storage` and
`plugin` plus the e2e battery with `npm@11`; did not run the Docker build" is an
honest report. "Tests pass" after one area's run is not.
