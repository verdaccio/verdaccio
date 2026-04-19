import { defineConfig } from 'cypress';

import { setupVerdaccioTasks } from '@verdaccio/e2e-ui';

const registryUrl = process.env.VERDACCIO_URL || 'http://localhost:4873';

export default defineConfig({
  e2e: {
    baseUrl: registryUrl,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on) {
      setupVerdaccioTasks(on, { registryUrl });
    },
  },
  video: false,
  screenshotOnRunFailure: false,
  env: {
    VERDACCIO_URL: registryUrl,
  },
});
