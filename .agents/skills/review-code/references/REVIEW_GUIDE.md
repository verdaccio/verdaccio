# Verdaccio Code Review Guide

How changes to `verdaccio/verdaccio` are reviewed, and how the decision to accept,
reject, narrow, or redesign a change is made. A human or an AI reviewer applying it
should reach the same bar.

The central question for any PR:

> Does this change solve a real registry problem, in the layer that owns it, without
> breaking what npm clients and existing configurations rely on, and without an
> unacceptable security, performance, or maintenance cost — and is it the _smallest
> correct version_ of itself?

Verdaccio is a network service that stores and serves code other people will execute.
Every request body, package name, tarball, uplink response, and configuration file is
input; most of it is attacker-reachable. Review with that in mind.
[`AGENTS.md`](../../../../AGENTS.md) points here. Automated reviewers, when enabled on
a PR, are held to the same rules; their presence is not guaranteed.

## Review priorities

1. **Security first** (§1).
2. **Client compatibility and correctness** (§2) — the registry API is a contract with
   npm, pnpm, yarn, bun, and deno.
3. **Performance** (§3) — tarball streaming, packument serving, uplink proxying, and
   auth run on every request.
4. **Product fit** (§4) — new config keys, routes, and plugin hooks are surface that
   must be maintained on every release line.
5. **Maintainability always** — the right layer and abstraction over a one-off patch.

---

## 1. Security review rules

Treat as attacker-controlled: package names and scopes, versions, dist-tags, filenames
in tarball URLs, publish bodies (`versions`, `dist.tarball`, `_attachments`, `readme`,
`_rev`), tarball contents, uplink responses (packuments, headers, redirects), request
headers (`Authorization`, `X-Forwarded-*`, `Host`, `Accept`), query strings, web UI
input, htpasswd and token stores on disk, and every configuration file loaded from a
path the operator did not write themselves. Surface plausible issues even when they are
edge cases, but always explain the exploit path and the impact on the _changed_ code.

Look especially for:

- **Path construction from request data.** Package name, scope, version, and filename
  reach `local-storage` as filesystem paths. Anything that bypasses
  `validationUtils.validateName` / `validatePackage`, decodes twice, or joins a
  user-controlled segment without normalisation is a traversal or an overwrite.
- **Server-side request forgery.** URLs stored in a packument (`dist.tarball`,
  `_distfiles`) or returned by an uplink must not be fetched blindly, and uplink
  credentials must only be sent to hosts that uplink serves. A client-published
  package can carry any URL.
- **Trust decisions on the wrong data.** Package access rules (`access`, `publish`,
  `unpublish`, `$all`, `$authenticated`, `$anonymous`), group membership, token scopes,
  and 2FA state must be evaluated from the authenticated identity, never from the body.
  Check that a new route goes through the same `auth` middleware as its siblings.
- **Credential handling.** Tokens, JWT secrets, htpasswd hashes, uplink `auth`, and
  `Authorization` headers must not be logged, echoed in errors, written to metadata,
  or forwarded to a different host. Compare secrets with constant-time helpers.
- **Uplink responses are untrusted input.** Status codes, headers, `ETag`, redirects,
  and packument content from an uplink must be validated before they influence local
  state or are relayed to a client. A malicious or compromised uplink must not be able
  to make the registry serve a tarball for a different package or poison the cache.
- **Tarballs and metadata on disk.** Writes must be atomic (temp file plus rename) and
  fail-safe; a crash mid-write must not leave a truncated tarball that later serves as
  the package. Integrity (`shasum`, `integrity`) is preserved exactly and verified where
  the code claims to.
- **Denial of service.** Unbounded buffering of request bodies or tarballs, regexes on
  user input, unbounded `JSON.parse` of uplink bodies, missing timeouts on uplink calls,
  and per-request work that scales with the number of stored packages.
- **Web UI.** README and package metadata are rendered in the browser: sanitisation,
  `url_prefix` handling, open redirects, and anything that lands in an `href` or inline
  script.
- **Reverse proxy assumptions.** `X-Forwarded-*` and `Host` are only trustworthy when
  the operator says so; changes to `server.trustProxy` behaviour, generated tarball
  URLs, or rate limiting must not be spoofable from the public side.
- **Configuration defaults.** A security-relevant default (`security`, `max_body_size`,
  `auth` settings, `publish.allow_offline`, uplink `strict_ssl`) is a contract;
  loosening one is a breaking change that needs a major changeset and a migration note.
- **Dependencies.** New runtime dependencies in a package that touches auth, storage,
  or tarballs are reviewed for maintenance status and for what they pull in.

Recurring judgement calls:

- **Never strip or normalise an identity used for trust.** A scoped name, a
  `%2f`-encoded path, a version string, or an uplink hostname stays byte-exact where it
  gates access or selects a file.
- **A fix in one call site is not a fix.** If a validation belongs in `store` or
  `core`, patching only the `api` route leaves the web UI or a plugin exposed.
- **Version coverage is part of the fix.** A bug fixed here that also exists on another line is not finished until that line has its own PR: `master` for the equivalent code path, and `8.x` when the defect is in a `@verdaccio/*` module rather than in `src/` (then the fix is made there first and bumped here).
- **Do not describe the exploit in public text** (PR title, body, changeset) before the
  fix ships on every supported line. The changeset says what changed for users, not how
  to abuse the old code.

**Don't overreact to audit output.** An advisory on a dev-only dependency or on a code
path Verdaccio never calls does not justify a breaking upgrade. A misconfigured
deployment (open publish to `$anonymous`, no reverse proxy TLS) is documentation, not a
code bug.

---

## 2. Client compatibility and correctness

The CLI e2e battery (`verdaccio/e2e-tests`) runs npm, pnpm and yarn against this line in
its own workflow. Each client has its own expectations; a change that works for `npm`
alone is not done.

- **Match registry.npmjs.org.** Status codes, `Content-Type`, `ETag`/`304` handling,
  abbreviated manifests (`application/vnd.npm.install-v1+json`), `%2f`-encoded scoped
  paths, `dist-tags`, `_rev`, `time`, `users`, deprecation, and the shape of error
  bodies are contracts. Before changing one, read what the public registry and the npm
  CLI (`npm/cli`) actually do.
- **Publish semantics.** Conflicts (`409`), re-publishing an existing version,
  `--tag`, unpublish rules, deprecate, dist-tag add/rm, and
  `_attachments` handling must keep the behaviour clients rely on.
- **Uplink merge.** Local versions win where the code says they win; `_distfiles`
  bookkeeping, cache expiry (`maxage`), `fail_timeout`, and offline behaviour are
  observable and tested.
- **Storage plugins are external code.** `@verdaccio/types` interfaces, method
  signatures, stream contracts, and error codes are the API third-party storage and
  auth plugins implement. A change there is breaking.
- **Configuration is an API.** Existing keys keep their meaning; new keys have a
  default that preserves today's behaviour; removals get a deprecation warning
  (`docs/warnings.md`) before they go.
- **Errors carry the right status.** Route code uses `errorUtils` and `HTTP_STATUS`;
  a `500` where a `404`/`403`/`409` belongs is a bug, and a swallowed error that turns
  into a silent `200` is a worse one.
- **Streams.** Tarball reads and writes are pipelines; check ordering of headers and
  data, back-pressure, error propagation on both ends, and that a failed upload leaves
  neither a half-written file nor a manifest entry pointing at it.
- **Windows and case sensitivity** for anything that builds paths or compares names.

---

## 3. Performance review rules

Every request pays for auth, config lookup, and logging; packument and tarball routes
pay for storage and uplinks. Be skeptical of extra work on those paths.

- **Never buffer a tarball to apply a change.** Streaming is the contract; a change
  that reads a whole tarball into memory needs a very good reason and a size bound.
- **No synchronous filesystem or crypto on the request path.**
- **Uplink calls are the expensive part.** Extra round trips per request, missing
  cache use, or lost `ETag` revalidation show up immediately under an install storm.
- **A performance change must be measured.** If it is pitched as perf, there is a
  number with the scenario (cold/warm cache, concurrent installs, package count) and
  the branch it was taken on.
- **Do not trade correctness for a micro-optimisation.** Order-dependent output,
  weakened locking, or a dropped invariant is a rejection even with a good number.

---

## 4. First-pass triage: should this exist at all?

Before reading the diff line by line, decide whether the change belongs:

- Is the problem real, reproducible, and Verdaccio's to solve (not a client bug, not a
  reverse-proxy misconfiguration)?
- Does an existing configuration key, package-access rule, plugin hook, or uplink
  option already cover it? If so, the change is documentation.
- Is the scope one logical change? Renames, formatting, dependency bumps, and
  unrelated fixes travel in their own PR.
- Does it belong on this branch? `6.x` takes bug fixes only; features go to `master`. A fix belongs on every line
  that has the bug.
- Is it a new bundled plugin or a new package? Those never land on a maintenance line;
  the answer is a discussion thread on `master`, not a review.

When a change does not belong, say why in one paragraph and name what would.

---

## 5. Product and surface rules

- New configuration keys, CLI flags, routes, and plugin hooks are permanent surface.
  Add them only when the benefit is clear and the default keeps current behaviour.
- Established npm semantics win over invention: if npm has a name, a header, or a
  status for it, use that.
- The web UI is `@verdaccio/ui-theme`, developed on `master`; UI changes are made there,
  not in this branch.
- Avoid user-visible noise: no new `info`-level logs on the hot path, no new startup
  warnings without a `VERWAR` code in `docs/warnings.md`.

---

## 6. Architecture rules

- **Put logic in the owning layer.** This branch owns the wiring in `src/` (startup,
  config, auth and storage composition, the registry API in `src/api`); logic that
  belongs to a `@verdaccio/*` module goes to the branch that develops it, not here.
- **Reuse before you write.** `@verdaccio/core` utilities, `@verdaccio/config`, and
  `src/lib/*-utils.ts` exist for this. Extract to the
  shared package instead of copying, but do not add an abstraction for a single caller.
- **Plugins stay pluggable.** Core code must not special-case the bundled
  `local-storage` or `htpasswd` plugins in a way a third-party plugin cannot follow.

---

## 7. Test expectations

Tests prove the changed behaviour, not merely execute nearby code.

- A **regression test that fails without the fix**.
- The **right level**: a unit test for a helper; a `test/unit/modules/<area>` suite
  (supertest through `test/unit/__helper/api.ts`) for a route or a storage path; a
  `nock`ed uplink for proxy behaviour; the e2e CLI battery only for client wiring that
  a package manager exercises.
- **Meaningful assertions**: check the effect (status, body shape, file on disk,
  header order), so the test cannot pass on an empty result.
- **No network.** `vitest.setup.mjs` blocks it; a test that needs the network is
  wrongly designed.
- **Conventions**: `test/unit/modules/<area>/*.spec.ts`, fixtures from `test/unit/partials`, no
  hard-coded shasums of real packages, no dependence on timing unless the test controls
  the clock.
- Never dismiss a failure as pre-existing; investigate and fix it in the PR.

---

## 8. Changesets, docs, and versioning

- **Change to `src/` or a dependency bump → changeset for `verdaccio` required.** Tests,
  docs, CI, and tooling → none; a maintainer adds the `skip changeset` label (external
  contributors do not).
- **Bump type**: `patch` for fixes and dependency bumps; `minor` only for a backport
  maintainers agreed to ship on 6.x; never `major`. A `patch` here releases to `latest`.
- **One changeset per PR**, naming `verdaccio`.
- **The text is the changelog entry and must be developed enough**: user-visible effect
  first, then what triggered it, what changed, what the operator must do, and the
  affected versions. Several paragraphs are fine; a one-liner for a behaviour change is
  a finding. Nothing about files, no exploit detail. It must describe what the code
  actually does.
- New environment variables are documented in `docs/env.variables.md`; config keys in
  the website repository.

---

## 9. Release-line coverage

- New features: `master` only. A feature PR against `6.x` is declined.
- Bug fixes: A bug fixed here that also exists on another line is not finished until that line has its own PR: `master` for the equivalent code path, and `8.x` when the defect is in a `@verdaccio/*` module rather than in `src/` (then the fix is made there first and bumped here).
- The port is reviewed on its own: each branch has its own toolchain and the code may
  have diverged; a clean cherry-pick still needs its tests run there.
- When a bot says a symbol is unused, it may be looking at one branch only.

---

## 10. Dependencies

Before adding one: check for an existing helper in `core` or `config`; compare
maintained packages; add it to the narrowest package; avoid heavy dependencies for
small conveniences; never hand-roll path normalisation, tar handling, semver, or
shell escaping. New third-party versions must clear the workspace's seven-day
`minimumReleaseAge`.

---

## 11. PR hygiene

- One logical change per PR; ports to other branches are separate PRs that link the
  original.
- Title is lowercase Conventional Commits; it becomes the squash commit. The body stays
  brief (problem and approach), with no test plan or validation log.
- Labels: one release-line label plus content labels; `security` is the
  maintainer's call; `AI assisted` is added by the author to their own PR or by a
  maintainer.
- Changeset present, or a reason why none is needed and `skip changeset` applied by a
  maintainer.
- Review threads are resolved only after the fix is on the branch (link the commit) or
  explicitly declined with rationale.
- Automated-review findings, when a bot is enabled, are classified — valid, false positive, already fixed, out
  of scope — not blindly applied or dismissed.

---

## 12. How feedback is written

Short, direct, specific.

- **Ask "why" when the diff does not say.** A question exposes an unjustified change
  faster than a paragraph.
- **Name the scenario**: the request, the config, the client, the file on disk that
  goes wrong.
- **Use GitHub `suggestion` blocks** for exact wording.
- **Be honest about uncertainty**, and say what would settle it (a test, a run against
  a client).
- **When declining a suggestion, justify it concretely**: the invariant it breaks, the
  cost it adds, the client it would break.
- Do not nitpick what oxlint and oxfmt already enforce.

---

## 13. Reviewer's checklist

For each PR, in order:

1. **Should it exist?** Real, in scope, on the right branch, not already covered by
   configuration. (§4)
2. **Security.** Walk §1 against the diff; explain any exploit path. (§1)
3. **Client compatibility.** Same status, shape, headers, and semantics as
   registry.npmjs.org; every client in the matrix still works. (§2)
4. **Performance.** Hot path touched? Streaming preserved? Number provided if pitched
   as perf. (§3)
5. **Scope.** Every touched file justified; unrelated changes split out. (§4, §11)
6. **Layer and reuse.** Logic where it belongs; no duplicate helper; plugins still
   pluggable. (§6)
7. **Surface and contract.** Config defaults preserved, plugin interfaces intact, no
   new noise. (§5)
8. **Tests.** Right level, regression-proving, no network, meaningful. (§7)
9. **Changeset.** Present iff a published package changed; right bump; release-note
   voice; no exploit detail. (§8)
10. **Release-line coverage.** Bug fixes ported or scheduled for every affected line.
    (§9)
11. **Conventions.** `errorUtils` and `HTTP_STATUS`, no swallowed errors, logger not
    console, `import.meta.dirname`, oxfmt-clean, dependency in the right package.
    (`AGENTS.md`)

A change is mergeable when it is the **smallest correct, secure, client-compatible
version of a thing Verdaccio should do**, in the layer that owns it, proven by a
meaningful test, documented if user-visible, and covered on every affected release line.
