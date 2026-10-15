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

describe('change password navigation', () => {
  it('does not offer change password in the login dialog', () => {
    cy.visit(registryUrl);
    cy.getByTestId(config.testIds.header.loginButton).click();
    cy.getByTestId(config.testIds.login.dialog).should('be.visible');
    cy.get('a[href="/-/web/change-password"]').should('not.exist');
  });

  it('opens change password from the signed-in account menu', () => {
    cy.intercept('POST', '/-/verdaccio/sec/login').as('menuLogin');
    cy.visit(registryUrl);
    cy.login(config.credentials.user, config.credentials.password, {
      loginButton: config.testIds.header.loginButton,
      ...config.selectors.loginDialog,
    });
    cy.wait('@menuLogin').its('response.statusCode').should('eq', 200);
    cy.getByTestId(config.testIds.header.logInDialogIcon).click();
    cy.getByTestId('changePasswordMenuItem').should('contain.text', 'Change Password').click();
    cy.location('pathname').should('eq', '/-/web/change-password');
    cy.get('input[name="oldPassword"]').should('be.visible');
    cy.get('[role="menu"]').should('not.exist');
  });
});
