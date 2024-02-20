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

  it('should open dialog settings tabs are present', () => {
    cy.visit(ctx.url);
    cy.getByTestId('header--tooltip-settings').click();

    cy.contains('Package Managers');
    cy.contains('Translations');
  });

  it('should close dialog settings tabs are present', () => {
    cy.visit(ctx.url);
    cy.getByTestId('header--tooltip-settings').click();
    cy.get('#registryInfo--dialog-close').click();
    // check for content at the dialog should not be there
    cy.get('#panel1a-header').should('not.exist');
  });

  it('should expand npm dialog registry details', () => {
    cy.visit(ctx.url);
    cy.getByTestId('header--tooltip-settings').click();
    cy.get('#panel1a-header').click();
    cy.contains(/npm set registry/);
    cy.contains(/npm adduser --registry/);
    cy.contains(/npm profile set password/);
  });

  it('should expand pnpm dialog registry details', () => {
    cy.visit(ctx.url);
    cy.getByTestId('header--tooltip-settings').click();
    cy.get('#panel3a-header').click();
    cy.contains(/pnpm set registry/);
    cy.contains(/pnpm adduser --registry/);
    cy.contains(/pnpm profile set password/);
  });

  it('should expand yarn dialog registry details', () => {
    cy.visit(ctx.url);
    cy.getByTestId('header--tooltip-settings').click();
    cy.get('#panel2a-header').click();
    // some initial explanation
    cy.contains(/Yarn classic configuration differs from Yarn/);
    // smoke test matches, (this is deelpy tested in the unit test)
    cy.contains(/.yarnrc.yml/);
    cy.contains(/npmRegistryServer:/);
  });
});
