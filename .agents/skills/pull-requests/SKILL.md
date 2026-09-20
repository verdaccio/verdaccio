---
name: pull-requests
description: Take a change through a verdaccio/verdaccio pull request — branch, checks, changeset, title, body, labels, draft-to-ready, then the CI and review rounds after every push, plus the port PRs to other release lines. Use when opening a PR, after pushing to one, when a check fails, or when review comments arrive.
---

# Pull requests

Opening the PR is the middle of the task. It is done when the checks are green, the
review round has nothing left to act on, and every release line that needs the change
has its own PR or an explicit note that the port is pending.

Read the commit and label rules in [AGENTS.md](../../../AGENTS.md) first; this skill
is the workflow around them.

## Before opening

1. Branch from the current base: `git fetch origin master` then
   `git switch -c <type>/<short-name> origin/master` (for a port, from `origin/6.x`).
2. Run the checks that cover the change with the
   [testing-changes](../testing-changes/SKILL.md) skill, then `pnpm lint`,
   `pnpm format:check`, and the type check for touched packages. **CI does not run on
   draft PRs**, so this local pass is the only gate until the PR is marked ready.
3. Add one changeset for the PR, naming every published package it touches
   (`pnpm changeset` or a hand-written `.changeset/<slug>.md`), when a
   published package changed. Otherwise say in the PR body why none is needed; the
   `skip changeset` label is applied by a maintainer, never by an external author.
4. Review your own diff with the [review-code](../review-code/SKILL.md) skill. A
   finding caught here costs one commit; the same finding caught by a reviewer costs a
   round.
5. Confirm the husky hooks are installed (`git config core.hooksPath` points at
   `.husky/_`); commit normally so the pre-commit format, lint, and lockfile checks
   run. Never `--no-verify`.

Commit messages are lowercase Conventional Commits, no AI attribution trailers. Push
only when the user or calling workflow authorised it.

## Opening

```bash
gh pr create --repo verdaccio/verdaccio --base master --title "fix(store): <what changed>" --body-file <body.md> [--draft]
```

Without `gh`, push the branch and open the PR from the compare page GitHub prints in
the push output (or <https://github.com/verdaccio/verdaccio/compare>); the title, body,
labels, and draft checkbox are all on that form. Checks, review threads, and
mergeability are on the PR page; labels are in its sidebar (see
[pr-labels](../pr-labels/SKILL.md) for the API form).

**Title**: lowercase, Conventional Commits, scope optional. It becomes the squash
commit, so write the history entry you want. Port PRs say which line they target:
`fix(6.x): ...` or the same title suffixed `(6.x)`.

**Body**: brief. A few sentences a reviewer needs to understand the diff and nothing
else:

```markdown
<problem in one or two sentences, with the issue link when there is one: Closes verdaccio/verdaccio#NNNN>

<the approach in a sentence or two, and any decision a reviewer might question>
```

No test plan, no validation log, no file-by-file walkthrough, no "not included"
section; a pending port or follow-up is one sentence. No attribution footer. The
changeset is where the change is explained in full for users (it is the changelog
entry), so put the effort there and do not repeat it in the body. What you ran goes in
your report to the person who asked, not in the PR.

**Labels, immediately after creation** (a PR without labels is not finished): exactly
one release-line label (`7.x branch (next)` for `master`, `6.x branch (latest)` for
`6.x`) plus content labels (typically one to three). The [pr-labels](../pr-labels/SKILL.md) skill
has the taxonomy, the worked examples, the label you never apply (`security`) and the
one you apply only to your own PR when the author says so (`AI assisted`):

```bash
gh pr edit <n> --repo verdaccio/verdaccio --add-label "<release line>" --add-label "<content>"
```

## Draft or ready

CI runs only on ready PRs, and an automated reviewer, when one is enabled on the
repository, re-reviews on every push to one. Open as a draft
while the change is still moving and the local checks are your only gate; mark it ready
(`gh pr ready <n>`) as soon as the diff is what you want reviewed. Do not leave a draft
behind silently: either mark it ready or say in the body what is left.

## After every push

1. **Wait for the checks.** `gh pr checks <n> --watch` in the background, or poll.
   Watch to the end: the next push cancels the in-progress run, so a second failure you
   never saw costs another cycle.
2. **Read the whole round.** Inline threads, review bodies, and any summary comment
   from an automated reviewer if one ran. A bot is not guaranteed on this
   repository; a round with no bot comment is not a failure, and a human review
   is what merges the PR.
3. **Verify every finding** before acting; bots and humans alike are sometimes wrong,
   and a fix applied to a wrong finding is a new bug with a reviewer's blessing. Reply
   on each thread with the commit that fixed it (after it is on the remote) or the
   reason you are not acting, then resolve the thread. Replying and resolving are part
   of driving your own PR; posting anything else needs an explicit ask.
4. **Keep the title and body true.** Re-read them after any push that changes what
   the PR does and edit them (`gh pr edit --title/--body`); the title is what merges.
5. **Check mergeability** (`gh pr view <n> --json mergeable,mergeStateStatus`).
   `CONFLICTING` means rebase (`git rebase origin/<base>`; a lockfile conflict is
   resolved by `pnpm install`), then force-push with lease. Re-read the diff after a
   rebase. Do not merge the base into the branch.
6. Go back to 1 after the push that carries the fixes. Send fixes in one push; every
   push restarts any automated review that is running.

A round is finished when the checks are green, every reviewer who took part has
reported on the head commit, and none of it needs action. A quiet round is the stop
signal, not a round count; if nobody has reviewed yet, the PR is simply waiting for a
maintainer, and that wait is not yours to fill with pushes.

## Failing checks

Never write a failure off as pre-existing, flaky, or unrelated without evidence.
`gh run view <run-id> --log-failed`, reproduce it locally with the testing-changes
selection, fix the cause. The e2e CLI matrix fails per client; a failure in one
client is a compatibility finding, not noise. The changeset-check job fails on a PR
without a changeset unless a maintainer has labelled it `skip changeset`.

## Ports to other release lines

A bug fix on `master` that also exists on `6.x` (binary) or `8.x` (internal modules
6.x consumes) is not finished until each affected line has its own PR. Cherry-pick
onto a branch from that line, adapt (6.x uses yarn and an older toolchain; code may
have diverged), run that line's tests there, open the PR against that branch with the
matching release-line label, and link the original PR in the body. If the port is
deferred, say so in one sentence in the original PR body.

## Finishing

Report which findings were real, which were not, what was declined and why, the CI
state, and which ports exist or are pending. Do not add AI attribution anywhere on the
PR; the `AI assisted` label is how AI involvement is disclosed. The author adds it to
their own PR (apply it when the author tells you to), and maintainers may add it too.
