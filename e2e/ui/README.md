# E2E UI Tests

Cypress wiring around [`@verdaccio/e2e-ui`](https://www.npmjs.com/package/@verdaccio/e2e-ui).

```bash
pnpm build
pnpm test:e2e:ui:local        # headless
pnpm test:e2e:ui:local:open   # interactive
```

Each run uses a fresh temp storage and cleans up on exit.
