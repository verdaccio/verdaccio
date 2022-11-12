describe('publish spec', () => {
  let ctx: any = {};
  const credentials = { user: 'test', password: 'test' };
  beforeEach(async () => {
    // @ts-expect-error
    const registry = await cy.task('registry');
    ctx.url = registry.registryUrl;
    const pkgName = `@verdaccio/pkg-scoped`;
    cy.intercept('POST', '/-/verdaccio/sec/login').as('sign');
    cy.intercept('GET', '/-/verdaccio/data/packages').as('pkgs');
    cy.intercept('GET', `/-/verdaccio/data/sidebar/${pkgName}`).as('sidebar');
    cy.intercept('GET', `/-/verdaccio/data/package/readme/${pkgName}`).as('readme');
    cy.task('publishScoped', { pkgName });
  });

  it('should have one published package', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    // cy.getByTestId('package-title').should('have.length', 1);
  });

  it('should navigate to page detail', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.wait(300);
    cy.getByTestId('package-title').first().click();
  });

  it('should have readme content', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.getByTestId('package-title').first().click();
    cy.wait('@readme');
    cy.wait('@sidebar');
    cy.get('.markdown-body').should('have.length', 1);
    cy.contains('.markdown-body', /test/);
  });

  it('should click on dependencies tab', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.wait(300);
    cy.getByTestId('package-title').first().click();
    cy.wait('@readme');
    cy.wait('@sidebar');
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
    cy.wait(300);
    cy.getByTestId('package-title').first().click();
    cy.wait('@readme');
    cy.wait('@sidebar');
    cy.getByTestId('versions-tab').click();
    cy.getByTestId('tag-latest').children().invoke('text').should('match', /1.0.6/);
    cy.screenshot();
  });

  it('should click on uplinks tab', () => {
    cy.visit(ctx.url);
    cy.login(credentials.user, credentials.password);
    cy.wait('@sign');
    cy.wait('@pkgs');
    cy.wait(300);
    cy.getByTestId('package-title').first().click();
    cy.wait('@readme');
    cy.wait('@sidebar');
    cy.getByTestId('uplinks-tab').click();
    cy.getByTestId('no-uplinks').should('be.visible');
    cy.screenshot();
  });
});
