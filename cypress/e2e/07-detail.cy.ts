import { createRegistryConfig, detailTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    detail: {
      // master 404s an unknown version and no longer leaks the previous
      // package's version filter across SPA navigation (verdaccio#6210 + follow-ups)
      versionNotFound: true,
      staleVersionsNavigation: true,
    },
  },
});

detailTests(config);
