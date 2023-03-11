describe('home spec', () => {
  let ctx: any = {};
  beforeEach(async () => {
    // @ts-expect-error
    const registry = await cy.task('registry');
    ctx.url = registry.registryUrl;
  });

  it('title should be correct', () => {
    cy.visit(ctx.url);
    cy.location('pathname').should('include', '/');
    cy.title().should('eq', 'verdaccio-server-e2e');
  });

  it('version should be displayed', () => {
    cy.visit(ctx.url);
    cy.getByTestId('version-footer').contains('Powered by');
  });

  it('should match title with no packages published', () => {
    cy.visit(ctx.url);
    cy.getByTestId('help-card').contains('No Package Published Yet.');
  });

  it('should display instructions on help card', () => {
    cy.visit(ctx.url);
    cy.getByTestId('help-card').contains(`npm adduser --registry ${ctx.url}`);
    cy.getByTestId('help-card').contains(`npm publish --registry ${ctx.url}`);
  });

  it('should go to 404 page', () => {
    cy.visit(`${ctx.url}/-/web/detail/@verdaccio/not-found`);
    cy.getByTestId('404').contains(`Sorry, we couldn't find it.`);
  });
});
