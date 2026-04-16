import { changePasswordTests, createRegistryConfig } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

// Unlike the e2e-tests repo (which targets the published `verdaccio:6`
// docker image and has to skip the happy path around the unpublished
// reset_password inversion fix), this spec runs against the locally
// built 6.x source in this repo — where the fix lives — so every
// change-password scenario can execute.
const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
});

changePasswordTests(config);
