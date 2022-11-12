describe('sign spec', () => {
  let ctx: any = {};
  const credentials = { user: 'test', password: 'test' };
  beforeEach(async () => {
    // @ts-expect-error
    const registry = await cy.task('registry');
    ctx.url = registry.registryUrl;
    cy.intercept('POST', '/-/verdaccio/sec/login').as('sign');
  });

  it('should login user', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.getByTestId('logInDialogIcon').click();
    cy.wait(100);
    cy.getByTestId('greetings-label').contains(credentials.user);
  });

  it('should logout an user', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.getByTestId('logInDialogIcon').click();
    cy.wait(100);
    cy.getByTestId('logOutDialogIcon').click();
    cy.screenshot();
    cy.wait(200);
    cy.getByTestId('header--button-login').contains('Login');
    cy.screenshot();
  });
});
