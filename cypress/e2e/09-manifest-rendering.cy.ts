import { createRegistryConfig, manifestRenderingTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    manifestRendering: {
      // master renders string/array repository, funding and bugs, gravatar
      // avatars and email-less contributors (verdaccio#6210)
      stringForms: true,
      gravatarAvatars: true,
      developersWithoutEmail: true,
    },
  },
});

manifestRenderingTests(config);
