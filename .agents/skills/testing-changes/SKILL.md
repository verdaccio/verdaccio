---
name: testing-changes
description: Select and run the checks that cover a change in the verdaccio 8.x monorepo — rebuild the touched packages, run their tests and their dependents' tests, the e2e packages, lint and format, and the 6.x Docker image built from the local packages when the change is visible to the verdaccio 6 binary — and recognise the cases where a scoped run passes without testing anything. Use whenever verifying a change before committing or pushing, or when deciding what to run after an edit.
---

# Testing a change (8.x)

Run what the change affects. CI runs lint and format, a build and the tests on
Node.js 22, 24 and 26, and the e2e packages, so the local job is fast, honest
feedback. The pre-commit hook runs `pnpm format:check` and `pnpm lint` and
refuses the commit on either; format before committing.

## The one rule: rebuild before you test

Packages import each other through `build/`, not `src`. A test in
`packages/auth` that imports `@verdaccio/config` runs against
`packages/config/build/`. After editing `config`, an `auth` run that skips the
rebuild tests the old build and passes without touching your change.

```bash
pnpm build                                      # everything, once per checkout
pnpm --filter @verdaccio/config build           # the package you edited
pnpm --filter "@verdaccio/config..." build      # it plus what it depends on
```

## Selecting the run

Find the packages the diff touches, then test them and their dependents:

```bash
git diff --name-only origin/8.x...HEAD | cut -d/ -f1-3 | sort -u

pnpm --filter "[origin/8.x]" build              # packages changed since 8.x
pnpm --filter "...[origin/8.x]" test            # those packages and everything that depends on them
```

Narrower runs, once the touched packages are rebuilt:

```bash
pnpm --filter @verdaccio/config test                                # one package
pnpm --filter @verdaccio/config test test/config.spec.ts            # one file
pnpm --filter @verdaccio/config test test/config.spec.ts -t 'name'  # one case
pnpm test:e2e                                                       # the e2e packages, after pnpm build
```

Always go through the package's `test` script, not bare `vitest`: the logger
packages set `TZ=utc`, and `pnpm test` at the root excludes the e2e packages on
purpose.

| Change touches                                         | Run                                                                                            |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| `core`, `config`, `types`, `url`, `tarball`, `streams` | That package, then `pnpm --filter "...@verdaccio/<pkg>" test` for the dependents               |
| `auth`, `htpasswd`, `auth-memory`                      | Those packages, then `packages/e2e/auth-memory` (`pnpm test:e2e`)                              |
| `local-storage-legacy`, `file-locking`, `streams`      | Those packages, then `packages/e2e/local-storage-legacy`, then the 6.x image for a real client |
| `loaders`, `middleware`, `hooks`, `signature`          | Those packages, then `pnpm test:e2e` (plugin loading is exercised there)                       |
| `logger/*`                                             | The three logger packages, then a start of the 6.x image and a look at the output              |
| `package-filter`, `audit`, `memory`                    | The plugin's tests, then a 6.x image run with the plugin configured                            |

Always finish with `pnpm lint` and `pnpm format:check`; the hook and CI enforce
both.

## End to end against the real 6.x binary

The consumer of every package here is the `verdaccio` 6 binary, and
`docker/verdaccio6x` builds it with the local packages instead of the published
ones (`prepare.mjs` packs every workspace package and forces npm `overrides` to
the tarballs):

```bash
pnpm verdaccio:build          # build the image (SKIP_BUILD=1 to reuse an existing pnpm build)
pnpm verdaccio                # build and run it on port 4873
pnpm verdaccio:down
```

It needs a running Docker daemon; do not try to start it yourself, ask. With the
container up, point the CLI e2e battery from `verdaccio/e2e-tests` (branch
`main`) at `http://localhost:4873` for the client the reporter used, and
`npm@11` when a change touches publish, install, tarballs, dist-tags, search or
auth. This is the only way to see a change through the eyes of a 6.x operator
before the release and the 6.x bump.

## Gotchas that make a run lie

- **Stale build** (above). If a test passes when you expected a failure, rebuild
  the package you changed and run again.
- **Network is blocked.** `vitest.setup.mjs` disallows every host except
  localhost via `nock`. `Nock: Disallowed net connect` means the code under test
  reached the network; mock the uplink, do not widen the allow-list.
- **`pnpm test` skips e2e.** A green root run says nothing about plugin loading
  or storage on disk; `pnpm test:e2e` is a separate step and needs `pnpm build`
  first.
- **`ignoreScripts` is on.** Dependencies' install scripts do not run; a package
  that needs a native build lists it under `allowBuilds` in `pnpm-workspace.yaml`.
- **Release-age and overrides.** `pnpm-workspace.yaml` pins security overrides
  and a seven-day `minimumReleaseAge`; an install refused on either is policy,
  not a lockfile bug.
- **`fail-fast` in CI.** A failure on one Node.js version cancels the others;
  read the failed log, not the cancelled one.

## Reporting

Name what you ran and what you did not. "Rebuilt `config`, ran `config` and
`auth` plus `pnpm test:e2e`; did not build the 6.x image" is an honest report.
"Tests pass" after one package's run is not.
