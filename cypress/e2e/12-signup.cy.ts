import { createRegistryConfig, signupTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    signup: {
      // master posts to the real signup endpoint and logs the new user in
      // (verdaccio#6210 + follow-ups); requires flags.createUser: true
      happyPath: true,
      validation: true,
    },
  },
});

signupTests(config);
