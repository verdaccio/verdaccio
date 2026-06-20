---
---

chore(security): clear high-severity advisories from the production audit

Production `pnpm audit` (`--audit-level=high`) went from 7 high advisories to
2, using dependency updates and correct dependency placement only — no
resolution overrides:

- Move the published `verdaccio` server (a test fixture) from `dependencies`
  to `devDependencies` in the private e2e packages, and bump it 6.5.2 → 6.7.2.
  This removes the `e2e → verdaccio → …` chain from the production audit and
  clears `minimatch` (GHSA-3ppc-4f35-3m26, GHSA-7r86-cg39-jmmj,
  GHSA-23c5-xmqv-rm74) and `lodash` (GHSA-r5fr-rjxr-66jc).
- Update `form-data` to 4.0.6 (GHSA-hmw2-7cc7-3qxx) via the
  `@verdaccio/test-helper → supertest → superagent` chain.

The 2 remaining high advisories (`vite`, `ws`) are pulled exclusively by the
lint tooling (`@verdaccio/eslint-config → @vitest/eslint-plugin → vitest →
vite` / `jsdom → ws`) and are hard-pinned by vitest's internals; they cannot
be moved by a dependency update.

No published `@verdaccio/*` package source changed — only private test
fixtures and the lockfile — so this carries no version bump.
