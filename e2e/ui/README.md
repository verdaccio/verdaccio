# E2E UI Testing

Cypress UI end-to-end tests for Verdaccio. The actual test suites live in
[`@verdaccio/e2e-ui`](https://www.npmjs.com/package/@verdaccio/e2e-ui); this
package only wires them into a Cypress project.

## What is covered

`cypress/e2e/verdaccio.cy.ts` registers the suites exported by
`@verdaccio/e2e-ui`:

- `homeTests` — title, help card, packages API health, header, 404
- `signinTests` — login / logout / form validation
- `layoutTests` — header, footer, ui-options, theme switch
- `searchTests` — search input, results dropdown, navigation
- `settingsTests` — settings dialog, package managers, translations
- `publishTests` — publish a fixture and exercise the package detail page

## Running locally

A single command spins up a throwaway Verdaccio against an isolated temp
storage, runs Cypress, then tears everything down — so reruns never collide
on already-published packages or stale users:

```bash
# Build packages once (or after changes to ui-theme / server)
pnpm build

# Headless run
pnpm test:e2e:ui:local

# Interactive (cypress open)
pnpm test:e2e:ui:local:open
```

Both scripts shell out to [`scripts/run-local.mjs`](scripts/run-local.mjs),
which:

1. Creates a fresh `mkdtemp()` directory under the OS temp dir.
2. Materializes a copy of [`config/config.yaml`](config/config.yaml) inside
   it with absolute paths for `storage` and `auth.htpasswd.file`, so each
   run starts with empty storage and an empty htpasswd.
3. Spawns `node packages/verdaccio/bin/verdaccio --config <tmp>/config.yaml`
   and waits for `/-/ping`.
4. Pre-creates the `test` / `test` user that the signin suite needs.
5. Runs `cypress run` (or `cypress open` with `--open`) against
   `http://localhost:4873`.
6. On exit (or `Ctrl+C` / `SIGTERM`) kills Verdaccio and removes the temp dir.

## Contribute

To add coverage, contribute new suites (or fixes) upstream in the
`@verdaccio/e2e-ui` package and bump the version pinned in `package.json`.
