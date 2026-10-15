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

describe('change password session requirement', () => {
  const path = '/-/web/change-password';
  const message = 'Sign in to change your password.';
  const signIn = (user = config.credentials.user, password = config.credentials.password) => {
    cy.get(config.selectors.loginDialog.usernameInput).type(user);
    cy.get(config.selectors.loginDialog.passwordInput).type(password, { log: false });
    cy.get(config.selectors.loginDialog.submitButton).click();
    cy.getByTestId(config.testIds.login.dialog).should('not.exist');
    cy.get('input[name="oldPassword"]').should('be.visible');
  };

  it('requires sign-in for a direct visit and returns to the password form', () => {
    cy.visit(`${registryUrl}${path}`);
    cy.contains(message).should('be.visible');
    cy.get('input[name="oldPassword"]').should('not.exist');
    signIn();
    cy.location('pathname').should('eq', path);
    cy.get('input[name="oldPassword"]').should('be.visible');
    cy.getByTestId(config.testIds.login.dialog).should('not.exist');
  });

  it('requires sign-in when opening the page with an expired session', () => {
    cy.visit(`${registryUrl}${path}`, {
      onBeforeLoad(win) {
        win.localStorage.setItem('username', config.credentials.user);
        win.localStorage.setItem('token', `header.${btoa(JSON.stringify({ exp: 1 }))}.signature`);
      },
    });
    cy.contains(message).should('be.visible');
    cy.get('input[name="oldPassword"]').should('not.exist');
    cy.window().its('localStorage').invoke('getItem', 'token').should('be.null');
    signIn();
    cy.get('input[name="oldPassword"]').should('be.visible');
  });

  it('clears the form and requests sign-in when the server rejects the session', () => {
    cy.visit(`${registryUrl}${path}`);
    signIn();
    cy.intercept('PUT', '/-/verdaccio/sec/reset_password', {
      statusCode: 401,
      body: { message: 'session expired' },
    }).as('expiredSession');
    cy.get('input[name="username"]').type(config.credentials.user);
    cy.get('input[name="oldPassword"]').type(config.credentials.password, { log: false });
    cy.get('input[name="newPassword"]').type('temporary-new-password', { log: false });
    cy.get('input[name="confirmPassword"]').type('temporary-new-password', { log: false });
    cy.get('form button[type="submit"]').click();
    cy.wait('@expiredSession');
    cy.contains(message).should('be.visible');
    cy.get('input[name="oldPassword"]').should('not.exist');
    signIn();
    cy.get('input[name="oldPassword"]').should('have.value', '');
    cy.get('input[name="newPassword"]').should('have.value', '');
    cy.get('input[name="confirmPassword"]').should('have.value', '');
  });

  it('changes the password successfully after signing in from a direct visit', () => {
    const user = `password-flow-${Date.now()}`;
    const oldPassword = 'initial-test-password';
    const newPassword = 'changed-test-password';
    cy.request('PUT', `${registryUrl}/-/user/org.couchdb.user:${user}`, {
      name: user,
      password: oldPassword,
    })
      .its('status')
      .should('eq', 201);
    cy.visit(`${registryUrl}${path}`);
    signIn(user, oldPassword);
    cy.intercept('PUT', '/-/verdaccio/sec/reset_password').as('passwordChange');
    cy.get('input[name="username"]').type(user);
    cy.get('input[name="oldPassword"]').type(oldPassword, { log: false });
    cy.get('input[name="newPassword"]').type(newPassword, { log: false });
    cy.get('input[name="confirmPassword"]').type(newPassword, { log: false });
    cy.get('form button[type="submit"]').click();
    cy.wait('@passwordChange').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/-/web/success');
    cy.request('POST', `${registryUrl}/-/verdaccio/sec/login`, {
      username: user,
      password: newPassword,
    })
      .its('status')
      .should('eq', 200);
    cy.request({
      method: 'POST',
      url: `${registryUrl}/-/verdaccio/sec/login`,
      body: { username: user, password: oldPassword },
      failOnStatusCode: false,
    })
      .its('status')
      .should('eq', 401);
  });
});
