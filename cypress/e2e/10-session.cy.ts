import { createRegistryConfig, sessionTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    session: {
      // master purges an expired token from localStorage on boot (verdaccio#6210)
      expiredTokenPurged: true,
    },
  },
});

sessionTests(config);
