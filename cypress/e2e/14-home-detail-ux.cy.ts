import { createRegistryConfig, homeDetailUxTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.expose('VERDACCIO_URL') || 'http://localhost:4873';

// every probe of the 9.x home, detail and settings ux ships with this ui
const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    homeDetailUx: {
      homeToolbar: true,
      detailTabInUrl: true,
      welcomeGuide: true,
      installBunAndNpmrc: true,
      copyFeedback: true,
      searchGrouping: true,
      versionLink: true,
      settingsPublishTab: true,
    },
  },
});

homeDetailUxTests(config);
