describe('publish spec', () => {
  let ctx: any = {};
  const credentials = { user: 'test', password: 'test' };
  beforeEach(async () => {
    // @ts-expect-error
    const registry = await cy.task('registry');
    ctx.url = registry.registryUrl;
    cy.intercept('POST', '/-/verdaccio/sec/login').as('sign');
    cy.task('publishScoped', { pkgName: 'pkg-protected' });
  });

  it('should navigate to package detail', () => {
    cy.visit(ctx.url);
    cy.getByTestId('header--button-login').click();
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.getByTestId('package-title');
    cy.screenshot();
  });
});
