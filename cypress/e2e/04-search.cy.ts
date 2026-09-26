import { createRegistryConfig, searchTests } from '@verdaccio/e2e-ui';

const registryUrl = Cypress.env('VERDACCIO_URL') || 'http://localhost:4873';

const config = createRegistryConfig({
  registryUrl,
  title: 'Verdaccio e2e',
  credentials: { user: 'test', password: 'test' },
});

// The upstream `searchTests` "no results" assertion types an impossible query
// like `xyzzy-no-such-package-<timestamp>` and expects an empty-state label.
// This Verdaccio build proxies search to the npmjs uplink, which returns
// fuzzy matches even for nonsense queries, so the empty state never renders.
//
// Stub the search endpoints so that any request whose path contains
// "xyzzy-no-such-package" responds with an empty result. The library's own
// `cy.intercept` for these URLs is a spy (no handler), and Cypress falls
// through to other matching routes when a spy fires — so this stub wins for
// the impossible query without affecting the other search tests, which use
// real queries that don't match this pattern.
beforeEach(() => {
  cy.intercept('GET', '**/-/verdaccio/data/search/*xyzzy-no-such-package*', {
    statusCode: 200,
    body: [],
  });
  cy.intercept('GET', '**/-/v1/search*xyzzy-no-such-package*', {
    statusCode: 200,
    body: { objects: [], total: 0, time: '' },
  });
});

searchTests(config);
