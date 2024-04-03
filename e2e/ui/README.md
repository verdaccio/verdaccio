# E2E UI Testing

## What is included on these test?

- Run acceptance test on UI
  - Check home page works correctly
  - Check navigation
  - Check sidebar
  - Check protected packages works

## Running test locally

- Ensure no other verdaccio server is running, cypress will spawn it's own registry instance
- To run all test: `pnpm test`
- To run single test: `pnpm test -- --spec 'cypress/e2e/home.cy.ts'`

## Contribute

More tests could be added to verify UI works as expected.
