import { createRegistryConfig, prefixedRoutingTests } from '@verdaccio/e2e-ui';

const config = createRegistryConfig({
  registryUrl: Cypress.expose('VERDACCIO_URL') || 'http://localhost:4873',
});

prefixedRoutingTests(config);
