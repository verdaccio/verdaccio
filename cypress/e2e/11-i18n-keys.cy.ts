import { createRegistryConfig, i18nKeyTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    i18n: {
      // the security.* namespace now ships in the bundle (verdaccio#6210)
      noRawKeysSecurityPages: true,
    },
  },
});

i18nKeyTests(config);
