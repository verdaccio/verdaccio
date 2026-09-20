---
name: implement-change
description: Implement a verdaccio bug fix, feature, or refactor — establish the affected release lines, check whether existing configuration, package-access rules, plugins, or uplink options already solve it, put the change in the layer that owns it, reuse existing helpers, add tests and a changeset, and validate. Use when asked to implement a change in this repository.
---

# Implement a change

Apply [AGENTS.md](../../../AGENTS.md). Keep repository policy there; this skill
connects implementation to the [testing-changes](../testing-changes/SKILL.md),
[review-code](../review-code/SKILL.md), and [pull-requests](../pull-requests/SKILL.md)
workflows.

## Understand the problem before adding code

Establish the intended behaviour and concrete success criteria from the request, the
issue, or the reproduction. For a bug, reproduce it first when practical: `yarn build`,
start a registry (`yarn start`, or `node bin/verdaccio --config <yaml> --listen 4873`),
and run the client command from the report against it. A
reporter's `npm install` symptom is a registry route plus a client expectation; find
both.

Decide which release lines the work concerns:

- A **feature** lands on `master` only; this branch does not take features.
- A **bug fix**: This checkout is branch `6.x`: the `verdaccio` binary in `src/`, on top of published `@verdaccio/*` modules from `8.x`. A bug in `src/` is fixed here; a bug in a `@verdaccio/*` module is fixed on `8.x` and bumped here. Check `master` for the same defect. A bug fixed here that also exists on another line is not finished until that line has its own PR: `master` for the equivalent code path, and `8.x` when the defect is in a `@verdaccio/*` module rather than in `src/` (then the fix is made there first and bumped here). Say in the PR when a port is pending.

Check whether Verdaccio can already do it. Configuration (the default config shipped with
`@verdaccio/config` documents the keys), package-access rules (`access`/`publish`/`unpublish` with groups),
uplink options (`maxage`, `timeout`, `fail_timeout`, `cache`, auth), bundled plugins,
middleware and filter plugins, and the web UI settings cover a lot. If an existing
capability fully solves the request, the deliverable is an explanation and possibly a
documentation change; if it partly solves it, extend the owning feature rather than
adding a parallel one. Respect an explicitly requested behaviour that nothing existing
provides.

Anything a package manager observes is a contract. Before changing a status code,
header, packument field, tarball URL, or auth flow, check what registry.npmjs.org and
the npm CLI (`npm/cli`) do, and remember the e2e matrix runs npm, pnpm, yarn classic
and modern, bun, and deno.

## Put it in the owning layer

Trace the request before editing: this branch owns the wiring in `src/lib` (startup,
config, auth and storage composition, the registry API in `src/api`); the published
`@verdaccio/*` modules own the rest. A fix that belongs in a module is made on the
branch that develops it, then bumped here.

Ask where the behaviour belongs, which abstraction it extends, and what else observes
it: a validation added only in an `api` route leaves the web UI and every plugin
exposed; a change in `store` affects every storage plugin. Changes to interfaces in
`@verdaccio/types` break third-party plugins and are out of scope on this line. Prefer a coherent
extension over a local workaround, and keep refactoring bounded to the change.

## Reuse before you write

Search `@verdaccio/core` utilities, `@verdaccio/config`, and `src/lib/*-utils.ts` before
writing a helper. If the logic exists but
is not exported, export or move it and update the callers. Preserve meaningful
differences; do not force unrelated behaviour into one generic function because it
looks similar. Prefer a maintained package to a hand-rolled parser or escaper, added to
the narrowest package that needs it (and older than the workspace's seven-day
release-age rule).

## Implement and validate

Implement the smallest cohesive change that meets the success criteria. Follow the
conventions in AGENTS.md: `errorUtils` and `HTTP_STATUS` for errors, the package
logger instead of `console`, streams for tarballs, `import.meta.dirname`, minimal
comments, no swallowed errors.

Add tests that prove the observable contract at the right level: a unit test for a
helper, a `test/unit/modules/<area>` suite for a route or a storage path, a `nock`ed
uplink for proxy behaviour, and an e2e scenario only for client wiring. A bug fix ships
with a regression test that fails without it.

Add one changeset for the PR naming `verdaccio` (patch for fixes and bumps), written
as a full changelog entry without exploit detail. Document a new environment variable
in `docs/env.variables.md`.

Rebuild the packages you touched, then use [testing-changes](../testing-changes/SKILL.md)
to run their tests, their dependents' tests, and the client-facing suites the change
can affect. Investigate every failure. Then review the complete diff with
[review-code](../review-code/SKILL.md), fix the verified findings, and rerun the
checks the fixes touch.

Report what changed, what existing capability was considered and why it was not
enough, the reuse or extraction chosen, the release lines covered and the ports still
pending, and exactly what was validated. Commit, push, or open a PR only when the user
or the calling workflow authorises it; use [pull-requests](../pull-requests/SKILL.md)
when taking the change through a PR.
