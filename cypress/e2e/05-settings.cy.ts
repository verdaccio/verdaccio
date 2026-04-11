import { createRegistryConfig, settingsTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    settings: {
      // The workspace ui-theme builds its bundle from
      // packages/plugins/ui-theme/src/i18n without crowdin's
      // download_translations/, so non-English locales fall back to
      // English at runtime. The language switcher click visibly does
      // nothing, which makes the upstream "should change the UI language"
      // assertion permanently fail. Re-enable once the e2e-ui CI job
      // (and `pnpm e2e:ui:local`) has a way to cache the crowdin
      // translations into the ui-theme build.
      languageSwitcher: false,
    },
  },
});

settingsTests(config);
