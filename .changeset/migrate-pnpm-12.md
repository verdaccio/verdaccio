---
---

Migrate the repo tooling to pnpm 12 (`pnpm@12.3.4`). No package code changes:
`ci:version:install` drops the `--frozen-lockfile=false` form that pnpm 12
rejects, and `minimumReleaseAgeStrict: true` keeps the release-age cooldown
blocking immature versions instead of auto-excluding them.
