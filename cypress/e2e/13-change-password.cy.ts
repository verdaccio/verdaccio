import { changePasswordTests, createRegistryConfig } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

// requires flags.changePassword: true on the registry
const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
  features: {
    changePassword: {
      // The happy-path BODY works on master (a valid change lands on the
      // success page), but the suite's after() cleanup calls cy.login to
      // restore the original password assuming a logged-out header — and
      // changing the password does not invalidate the JWT still in
      // localStorage, so the user stays logged in and cy.login can't find
      // the login button. Re-enable once the e2e-ui change-password after()
      // hook clears the session before its restore login.
      happyPath: false,
    },
  },
});

changePasswordTests(config);
