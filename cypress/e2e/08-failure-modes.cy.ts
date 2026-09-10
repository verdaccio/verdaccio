import { createRegistryConfig, failureModeTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    failureModes: {
      // master surfaces error states instead of blank pages / empty-registry
      // onboarding / "no results found" on network and 5xx failures (verdaccio#6210)
      homeNetworkError: true,
      detailErrorState: true,
      searchError: true,
      downloadError: true,
    },
  },
});

failureModeTests(config);
