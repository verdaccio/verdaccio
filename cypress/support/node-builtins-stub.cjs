// Empty stand-in for Node builtins (fs, child_process, ...) when bundling
// specs for the browser. @verdaccio/e2e-ui exposes its Node-only cy.task
// implementations from the same entry point as the browser test suites; the
// Node APIs are only invoked inside the tasks, which run in the Cypress
// server process, so the browser bundle never calls into this stub.
module.exports = {};
