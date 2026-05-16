---
'verdaccio': patch
---

chore: update Node.js to 24

Bumps the project's Node.js baseline to 24 across runtime and container, and adds a startup warning for users still on an older (but supported) Node.

- **Node 24 bump**: `.nvmrc` `22` → `24`; `Dockerfile` base image `node:22.22.1-alpine` → `node:24.15.0-alpine` (builder + runtime).
- **Soft-deprecation warning**: new `RECOMMENDED_NODE_VERSION = '22'` and `isVersionRecommended()` in `src/lib/cli/utils.ts`; the `init` command logs a `warn` at startup when Node is below the recommendation. `MIN_NODE_VERSION` stays at `'18'` — no hard break.
- **Tests**: unit tests for `isVersionRecommended` and the init warning path.

Compatibility: minimum supported Node remains **18** (warning only); recommended is **22+**; Docker images ship Node 24.
