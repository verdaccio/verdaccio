---
'verdaccio': patch
---

Update the proxy address dependency to correctly match trusted proxy subnets when determining client IP addresses. Earlier 7.x prereleases using the affected dependency can misidentify clients with certain IPv6 trust configurations. No configuration migration is required.

Update `@verdaccio/e2e-cli` to 4.0.0, which drops pnpm 10, and remove pnpm 10 from the CLI e2e matrix.
