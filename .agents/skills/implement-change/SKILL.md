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
then the e2e packages (`pnpm test:e2e`) or the 6.x Docker image built from the local
packages (`pnpm verdaccio`), and run the client command from the report against it. A
reporter's `npm install` symptom is a registry route plus a client expectation; find
both.

Decide which release lines the work concerns:

- A **feature** lands on `master` only; this branch does not take features.
- A **bug fix**: This checkout is branch `8.x`: the `@verdaccio/*` internal modules and bundled plugins that the `verdaccio` 6.x binary depends on. Bug fixes only; a fix is finished when it is released from here and bumped on `6.x`. Check `master` for the same defect. A bug fixed here is not finished until it is released (`chore: update versions 8.x`) and bumped on `6.x`, and until `master` has its own PR when the same code path exists there. Features never land here.

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

Trace the request before editing: routing and the store live in the 6.x binary
(`src/` on branch `6.x`); this branch owns `auth` (identity and access), `config`
(parsing and defaults), `local-storage-legacy` (files), `loaders` (plugins),
`middleware`, `hooks`, `signature`, and `core` (pure helpers).

Ask where the behaviour belongs, which abstraction it extends, and what else observes
it: a validation added only in an `api` route leaves the web UI and every plugin
exposed; a change in `store` affects every storage plugin. Changes to interfaces in
`@verdaccio/types` break third-party plugins and are out of scope on this line. Prefer a coherent
extension over a local workaround, and keep refactoring bounded to the change.

## Reuse before you write

Search `packages/core/core/src/*-utils.ts`, `@verdaccio/config`, and
`@verdaccio/test-helper` before writing a helper. If the logic exists but
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
helper, a `packages/e2e/*` suite for plugin loading and storage on disk, and the 6.x image
plus the CLI battery only for client wiring. A bug fix ships
with a regression test that fails without it.

Add one changeset for the PR, naming every published package it touches (patch for
fixes and bumps; never major on this line), written as a full changelog entry without
exploit detail.

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
