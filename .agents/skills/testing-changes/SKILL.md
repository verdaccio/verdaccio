---
name: testing-changes
description: Select and run the checks that actually cover a change in the verdaccio monorepo — rebuild the touched packages, run their tests and their dependents' tests, the api integration suite, the e2e CLI battery or the Cypress UI suite when the change is client- or UI-visible — and recognise the cases where a scoped run passes without testing anything. Use whenever verifying a change before committing or pushing, or when deciding what to run after an edit.
---

# Testing a change

Run what the change affects. CI runs the full pipeline on every ready PR (lint, format,
build, tests on Node.js 24 and 26, Docker build, the e2e CLI matrix, Cypress), so the
local job is fast, honest feedback, not a second full gate. What matters is that the
run you choose exercises the code you changed.

## The one rule: rebuild before you test

Packages import each other through `build/` (`exports` in every `package.json`), not
`src`. A test in `packages/api` that imports `@verdaccio/store` runs against
`packages/store/build/`. After editing `store`, an `api` run that skips the rebuild
tests the old build and passes without touching your change.

```bash
pnpm build                                      # everything, once per checkout
pnpm --filter @verdaccio/store build            # the package you edited
pnpm --filter "@verdaccio/store..." build       # it plus what it depends on
```

## Selecting the run

Find the packages the diff touches, then test them and their dependents:

```bash
git diff --name-only origin/master...HEAD | cut -d/ -f1-3 | sort -u

pnpm --filter "[origin/master]" build           # packages changed since master
pnpm --filter "...[origin/master]" test         # those packages and everything that depends on them
```

Narrower runs, once the touched packages are rebuilt:

```bash
pnpm --filter @verdaccio/store test                                # one package
pnpm --filter @verdaccio/store test test/versions.spec.ts          # one file
pnpm --filter @verdaccio/store test test/versions.spec.ts -t 'tag' # one case
pnpm --filter @verdaccio/store test -- --coverage=false            # faster
```

Always go through the package's `test` script, not bare `vitest`: some packages set
environment the tests rely on (`TZ=utc` for `logger`, `ui-theme`, `ui-components`;
`NODE_ENV=test` for `memory`; a longer timeout for `store`).

Map the change to the suites that prove it:

| Change touches                                         | Run                                                                                                |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| A helper in `core`, `config`, `url`, `tarball`, ...    | That package, then `pnpm --filter "...@verdaccio/<pkg>" test` for the dependents                   |
| A route in `packages/api` or `packages/web`            | `@verdaccio/api` integration tests (`test/integration`, supertest against `initializeServer`)      |
| `store`, `local-storage`, `proxy` (packument, tarball) | Those packages, `@verdaccio/api`, then the e2e CLI battery for the affected client flow            |
| `auth`, `htpasswd`, `auth-memory`, tokens, 2FA         | Those packages, `@verdaccio/api` (`login`, `token`, `tfa`, `profile` specs), e2e for login/publish |
| `config`, `cli`, `node-api`, `verdaccio`               | Those packages, then start the server (`pnpm start` or `node packages/verdaccio/bin/verdaccio`)    |
| UI (`ui-theme`, `ui-components`, `web`)                | `@verdaccio/ui-components`, `@verdaccio/ui-theme`, then `pnpm e2e:ui:local`                        |
| Anything a package manager observes                    | `./scripts/e2e-cli-local.sh <pm>` for each client the change can affect                            |
| Plugin interfaces in `@verdaccio/types`                | `pnpm type-check` across the workspace, the bundled plugins' tests                                 |

Always finish with `pnpm lint` and `pnpm format:check`; the pre-commit hook enforces
them on staged files, CI on everything.

## End-to-end

The CLI battery is `@verdaccio/e2e-cli` (repository `verdaccio/e2e-tests`). Locally:

```bash
pnpm build
./scripts/e2e-cli-local.sh npm@11       # also npm@10, npm@12, pnpm@10, pnpm@11, yarn-classic, yarn-modern@4, bun, deno
```

It starts a fresh registry on port 4873, runs the client scenarios, and cleans up. CI
runs the whole matrix; run at least the client the reporter used and `npm@11` when a
change touches publish, install, tarballs, dist-tags, search, or auth.

The UI battery is Cypress: `pnpm e2e:ui:local` (headless) or `pnpm e2e:ui:local:open`.
Docker-based flows (`pnpm docker`, `e2e/docker`) need a running Docker daemon.

## Gotchas that make a run lie

- **Stale build** (above). If a test passes when you expected a failure, rebuild the
  package you changed and run again.
- **Network is blocked.** `vitest.setup.mjs` disallows every host except localhost via
  `nock`. `Nock: Disallowed net connect` means the code under test reached the network;
  mock the uplink, do not widen the allow-list.
- **A port left behind.** A killed e2e run can leave a registry on port 4873
  (check with `lsof -i :4873`), and the next run then tests the wrong process.
- **Global package-manager settings.** A user-level `minimumReleaseAge` or registry
  override changes what `pnpm install` and the e2e clients do; a failure that only
  happens on your machine usually comes from `~/.npmrc` or the global pnpm config.
- **`fail-fast` in CI.** A test job failing on Node.js 26 cancels the Node.js 24 job;
  read the failed log, not the cancelled one.
- **Disabled tests.** Files named `*.__disabled__.ts` and `disabled_test/` folders are
  not run; a pass there proves nothing.

## Reporting

Name what you ran and what you did not. "Rebuilt `store`, ran `store` and `api`
integration tests plus the e2e battery with `npm@11`; did not run the UI suite" is an
honest report. "Tests pass" after one package's run is not.
