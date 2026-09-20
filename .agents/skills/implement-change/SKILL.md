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
issue, or the reproduction. For a bug, reproduce it first when practical: `pnpm build`,
start a registry (`pnpm start`, or `node packages/verdaccio/bin/verdaccio --config
<yaml> --listen 4873`), and run the client command from the report against it. A
reporter's `npm install` symptom is a registry route plus a client expectation; find
both.

Decide which release lines the work concerns:

- A **feature** lands on `master` only.
- A **bug fix** lands on every supported line that has the bug: `master` first, then a
  port to `6.x` (binary) and/or `8.x` (internal modules 6.x consumes). Check whether
  the code path exists there before promising a port, and say in the PR when it is
  pending.

Check whether Verdaccio can already do it. Configuration (`packages/config/src/conf/default.yaml`
documents the keys), package-access rules (`access`/`publish`/`unpublish` with groups),
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

Trace the request through the layers before editing: `api`/`web` (routing, status,
response shape) → `store` (local versus uplink merge, filters, stage) →
`local-storage` or the storage plugin (files) and `proxy` (uplink HTTP); `auth` for
identity and access; `config` for parsing and defaults; `core` for pure helpers.

Ask where the behaviour belongs, which abstraction it extends, and what else observes
it: a validation added only in an `api` route leaves the web UI and every plugin
exposed; a change in `store` affects every storage plugin. Changes to interfaces in
`@verdaccio/types` break third-party plugins and are major. Prefer a coherent
extension over a local workaround, and keep refactoring bounded to the change.

## Reuse before you write

Search `packages/core/core/src/*-utils.ts`, `@verdaccio/config`, the `store` lib
helpers, and `@verdaccio/test-helper` before writing a helper. If the logic exists but
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
helper, a `packages/api` integration test for a route, a `nock`ed uplink for `store`
and `proxy` behaviour, and an e2e scenario only for client wiring. A bug fix ships
with a regression test that fails without it.

Add one changeset for the PR, naming every published package it touches (patch for
fixes, minor for features, major for breaking config, plugin, or HTTP contract
changes), written as a release note without exploit detail. Update `docs/migrations-guide.md` for breaking
changes and `docs/warnings.md` for a new warning code.

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
