import { createRegistryConfig, layoutTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
});

layoutTests(config);
