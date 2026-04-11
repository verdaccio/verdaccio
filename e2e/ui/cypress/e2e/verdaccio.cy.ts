import {
  createRegistryConfig,
  homeTests,
  layoutTests,
  publishTests,
  searchTests,
  settingsTests,
  signinTests,
} from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  credentials: { user: 'test', password: 'test' },
});

homeTests(config);
signinTests(config);
layoutTests(config);
searchTests(config);
settingsTests(config);
publishTests(config);
