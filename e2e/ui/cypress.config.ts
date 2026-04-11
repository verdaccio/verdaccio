import { defineConfig } from 'cypress';

import { setupVerdaccioTasks } from '@verdaccio/e2e-ui';

const registryUrl = process.env.VERDACCIO_URL || 'http://localhost:4873';

export default defineConfig({
  retries: {
    runMode: 1,
    openMode: 0,
  },
  screenshotOnRunFailure: false,
  video: false,
  e2e: {
    baseUrl: registryUrl,
    setupNodeEvents(on) {
      setupVerdaccioTasks(on, { registryUrl });
    },
  },
  env: {
    VERDACCIO_URL: registryUrl,
  },
});
