---
name: pr-labels
description: Choose and apply the labels for a verdaccio/verdaccio pull request — exactly one release-line label plus one to three content labels from the repository's existing taxonomy, never security, and AI assisted only on the author's own PR. Use right after gh pr create, when editing a PR, when reviewing a PR whose labels are missing or wrong, or when asked which labels a change should carry.
---

# PR labels

**No PR without labels.** Every pull request carries exactly one release-line label and
one to three content labels, applied right after it is created:

```bash
gh pr edit <n> --repo verdaccio/verdaccio --add-label "<release line>" --add-label "<content>"
```

Labels come from the existing list only (`gh label list --repo verdaccio/verdaccio
--limit 300`, or <https://github.com/verdaccio/verdaccio/labels>); never create one.

Without `gh`, use the **Labels** sidebar on the PR page, or the REST API:

```bash
curl -s -X POST -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/verdaccio/verdaccio/issues/<n>/labels \
  -d '{"labels":["<release line>","<content>"]}'
```

If you cannot apply labels at all, list the exact labels in your report so the author
can add them.

## 1. Release-line label (always exactly one)

| Base branch of the PR | Label                 |
| --------------------- | --------------------- |
| `master` (9.x)        | `7.x branch (next)`   |
| `7.x`                 | `7.x branch (next)`   |
| `6.x`                 | `6.x branch (latest)` |
| `8.x`                 | `6.x branch (latest)` |

PRs against this branch (`7.x`) take `7.x branch (next)`. `7.x branch (next)` is the label in use for `master` and `7.x`; `8.x` PRs take `6.x branch (latest)` because everything released from there ships into 6.x. A port PR to another branch takes that branch's label,
not the original's. `4.x` and `5.x` are deprecated with no further development: no PR
targets them and their labels (`4.x deprecated`, `5.x branch (legacy)`) are not used.

## 2. Content labels (one to three)

The content label answers "which mental folder does this PR open?". A focused PR takes
two or three labels; a large multi-topic PR may take more, but every label must describe
something central to the change, never something tangential.

By nature of the change:

- `issue: bug` — fixes a reported defect (pair it with the area).
- `performance` — measurable optimisation; the numbers go in the PR body.
- `feat: breaking-change` — breaks configuration, plugin interfaces, or the HTTP contract.
- `dev: refactor` — no behaviour change.
- `dev: experiment` — new behaviour behind a flag or an experimental package.
- `dev: ci-build` — workflows and CI only. `dev: tooling` — repo tooling, scripts, lint.
- `dev: migration` — toolchain or dependency-major migrations.
- `docs`, `topic: readme`, `topic: testing`, `topic: e2e` — documentation and test-only work.
- `bot: dependencies` — automated bumps (Renovate, Dependabot).

By area (`topic: *`): `topic: proxy/uplinks`, `topic: web`, `topic: api`, `topic: search`,
`topic: config`, `topic: token`, `topic: logging`, `topic: core`, `topic: middleware`,
`topic: typescript`, `topic: devops`, `topic: offline-mode`, `topic: signature`,
`topic: env-variables`, `topic: npm`, `topic: pnpm`, `topic: yarn-modern`,
`topic: yarn-classic`, `topic: kubernetes`, `helm`, `Docker`, `topic: docker-compose`,
`topic: nginx`, `topic: apache`, `topic: windows`, `React` (UI components).

By subsystem: `feat: auth`, `feat: storage`, `feat: notifications`,
`plugin: local-storage`, `plugin: htpasswd`, `plugin: package-filter`,
`plugin: verdaccio-memory`, `cmd: publish`, `cmd: unpublish`, `cmd: owner`,
`cmd: npm team`, `cmd: npm deprecate`.

Process labels: `skip changeset` (docs, tests, CI, tooling: nothing published changes,
disables the changeset check; **maintainers only**, never on an external contributor's
PR, see §3), `WIP`, `dev: do-not-merge`, `dev: blocked`.

## 3. Labels you do not apply

- **`skip changeset` — maintainers only.** It bypasses a CI gate, so it is applied by a
  maintainer after confirming the PR changes nothing published. An external contributor
  states in the PR body why no changeset is needed and leaves the label to the
  maintainer.
- **`security` — never.** It publicly marks a PR as a security fix before a release
  carries it and hints at the vector. A security fix is labelled by area only
  (`topic: *`, `feat: *`); maintainers add `security` afterwards if they choose.
- **`AI assisted` — the author's (or a maintainer's) call, not a reviewer's.** It marks
  PRs containing AI-generated content. The author adds it to their own PR, and an agent
  working for the author applies it when the author says so; maintainers may add it as
  well. If you notice AI-generated content in a PR you did not author, mention it in
  your report; do not label it.

## 4. Choosing — worked examples from the history

- `perf(6.x): stop re-compressing tarballs…` → `performance` + `6.x branch (latest)`.
- `feat: staged publishing and 2FA` → `dev: experiment` + `7.x branch (next)`.
- `fix(search): include license in local results` → `topic: search` + `7.x branch (next)`.
- `fix(logger): honor JSON sync…` → `issue: bug` + `topic: logging` + `7.x branch (next)`.
- `fix: emit tarball content-length before data flows` → `issue: bug` + `feat: storage` +
  `plugin: local-storage` + `7.x branch (next)`.
- `fix: tarball download reliability — uplink selection…` (large, multi-topic) →
  `issue: bug` + `feat: storage` + `topic: proxy/uplinks` + `performance` +
  `7.x branch (next)`.
- `chore: migrate pnpm to v12` → `dev: migration` + `7.x branch (next)` (+ `skip changeset`,
  added by a maintainer).
- Workflow-only change → `dev: ci-build` + the release line.

Rule of thumb: a `perf(...)` title takes `performance`; anything touching uplinks,
remote tarballs, or the proxy takes `topic: proxy/uplinks`; a storage-layer change takes
`feat: storage` and the plugin label when a bundled plugin changed; UI work takes
`topic: web` and `React` when components changed.

## 5. When reviewing someone else's PR

Missing or wrong labels are a review finding, reported like any other. Fix them yourself
only when the task asked you to maintain the PR; otherwise name the labels it should carry.
