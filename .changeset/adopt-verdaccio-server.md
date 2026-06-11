---
'verdaccio': minor
---

Adopt `@verdaccio/server` and drop the local api/web/storage forks. A thin `Storage` wrapper is kept to support legacy callback-based storage plugins, and the unused helpers in `src/lib/utils.ts` were removed.
