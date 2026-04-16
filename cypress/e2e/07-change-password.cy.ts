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

// The published `@verdaccio/e2e-ui@2.4.0` change-password suite ends its
// happy-path test on `/-/web/success` with a valid JWT still in
// localStorage. Its `after()` hook then does `cy.visit('/')` + `cy.login`
// to restore the original password, but the home page renders the
// logged-in menu (no `header--button-login`) so `cy.login` times out.
//
// Mocha runs outer `afterEach` hooks *before* inner `after` hooks, so
// dropping the session here clears the way for the suite's restore step
// to find the Login button. Remove this block once the e2e-ui release
// that ships the equivalent cleanup inside the suite lands in
// `package.json`.
afterEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

changePasswordTests(config);
