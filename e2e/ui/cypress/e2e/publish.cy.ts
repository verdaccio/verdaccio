describe('publish spec', () => {
  let ctx: any = {};
  const credentials = { user: 'test', password: 'test' };
  beforeEach(async () => {
    // @ts-expect-error
    const registry = await cy.task('registry');
    ctx.url = registry.registryUrl;
    cy.intercept('POST', '/-/verdaccio/sec/login').as('sign');
    cy.intercept('GET', '/-/verdaccio/data/packages').as('pkgs');
    cy.intercept('GET', '/-/verdaccio/data/sidebar/pkg-scoped').as('sidebar');
    cy.intercept('GET', '/-/verdaccio/data/package/readme/pkg-scoped').as('readme');
    cy.task('publishScoped', { pkgName: 'pkg-protected' });
  });

  it('should have one published package', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.getByTestId('package-title').should('have.length', 1);
  });

  it('should navigate to page detail', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.getByTestId('package-title').click();
    cy.wait('@sidebar');
    cy.wait('@readme');
  });

  it('should have readme content', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.getByTestId('package-title').click();
    cy.wait('@sidebar');
    cy.wait('@readme');
    cy.get('.markdown-body').should('have.length', 1);
    cy.contains('.markdown-body', /test/);
  });

  it('should click on dependencies tab', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.getByTestId('package-title').click();
    cy.wait('@sidebar');
    cy.wait('@readme');
    cy.getByTestId('dependencies-tab').click();
    cy.wait(100);
    cy.getByTestId('dependencies').should('have.length', 1);
    cy.getByTestId('verdaccio')
      .children()
      .invoke('text')
      .should('match', /verdaccio/);
    cy.screenshot();
  });

  it('should click on versions tab', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.getByTestId('package-title').click();
    cy.wait('@sidebar');
    cy.wait('@readme');
    cy.getByTestId('versions-tab').click();
    cy.screenshot();
  });

  it('should click on uplinks tab', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.getByTestId('package-title').click();
    cy.wait('@sidebar');
    cy.wait('@readme');
    cy.getByTestId('uplinks-tab').click();
    cy.screenshot();
  });
});
