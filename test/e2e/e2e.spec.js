/**
 * @prettier
 */

const scopedPackageMetadata = require('./partials/pkg-scoped');
const protectedPackageMetadata = require('./partials/pkg-protected');

describe('/ (Verdaccio Page)', () => {
  let page;
  // this might be increased based on the delays included in all test
  jest.setTimeout(200000);

  const clickElement = async function(selector, options = { button: 'middle', delay: 100 }) {
    const button = await page.$(selector);
    await button.focus();
    await button.click(options);
  };

  const evaluateSignIn = async function() {
    const text = await page.evaluate(() => document.querySelector('#header--button-login').textContent);
    expect(text).toMatch('Login');
  };

  const getPackages = async function() {
    return await page.$$('.package-list-items .package-link a');
  };

  const logIn = async function() {
    await clickElement('#header--button-login');
    await page.waitFor(500);
    // we fill the sign in form
    const signInDialog = await page.$('#login--form-container');
    const userInput = await signInDialog.$('#login--form-username');
    expect(userInput).not.toBeNull();
    const passInput = await signInDialog.$('#login--form-password');
    expect(passInput).not.toBeNull();
    await userInput.type('test', { delay: 100 });
    await passInput.type('test', { delay: 100 });
    await passInput.dispose();
    // click on log in
    const loginButton = await page.$('#login--form-submit');
    expect(loginButton).toBeDefined();
    await loginButton.focus();
    await loginButton.click({ delay: 100 });
    await page.waitFor(500);
  };

  beforeAll(async () => {
    page = await global.__BROWSER__.newPage();
    await page.goto('http://0.0.0.0:55558');
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  });

  afterAll(async () => {
    await page.close();
  });

  test('should load without error', async () => {
    const text = await page.evaluate(() => document.body.textContent);

    // FIXME: perhaps it is not the best approach
    expect(text).toContain('Powered by');
  });

  test('should match title with no packages published', async () => {
    const text = await page.evaluate(() => document.querySelector('#help-card__title').textContent);
    expect(text).toMatch('No Package Published Yet');
  });

  test('should match title with first step', async () => {
    const text = await page.evaluate(() => document.querySelector('#help-card').textContent);
    expect(text).toContain('npm adduser --registry http://0.0.0.0:55558');
  });

  test('should match title with second step', async () => {
    const text = await page.evaluate(() => document.querySelector('#help-card').textContent);
    expect(text).toContain('npm publish --registry http://0.0.0.0:55558');
  });

  test('should match button Login to sign in', async () => {
    await evaluateSignIn();
  });

  test('should click on sign in button', async () => {
    const signInButton = await page.$('#header--button-login');
    await signInButton.click();
    await page.waitFor(1000);
    const signInDialog = await page.$('#login--form-container');

    expect(signInDialog).not.toBeNull();
  });

  test('should log in an user', async () => {
    // we open the dialog
    await logIn();
    // check whether user is logged
    const buttonLogout = await page.$('#header--button-logout');
    expect(buttonLogout).toBeDefined();
  });

  test('should logout an user', async () => {
    // we assume the user is logged already
    await clickElement('#header--button-account', { clickCount: 1, delay: 500 });
    await page.waitFor(1000);
    await clickElement('#header--button-logout > span', { clickCount: 1, delay: 500 });
    await page.waitFor(1000);
    await evaluateSignIn();
  });

  test('should check registry info dialog', async () => {
    const registryInfoButton = await page.$('#header--button-registryInfo');
    registryInfoButton.click();
    await page.waitFor(500);

    const registryInfoDialog = await page.$('#registryInfo--dialog-container');
    expect(registryInfoDialog).not.toBeNull();

    const closeButton = await page.$('#registryInfo--dialog-close');
    closeButton.click();
  });

  test('should publish a package', async () => {
    await global.__SERVER__.putPackage(scopedPackageMetadata.name, scopedPackageMetadata);
    await page.waitFor(1000);
    await page.reload();
    await page.waitFor(1000);
    const packagesList = await getPackages();
    expect(packagesList).toHaveLength(1);
  });

  test('should navigate to the package detail', async () => {
    const packagesList = await getPackages();
    const firstPackage = packagesList[0];
    await firstPackage.click({ clickCount: 1, delay: 200 });
    await page.waitFor(1000);
    const readmeText = await page.evaluate(() => document.querySelector('.markdown-body').textContent);
    expect(readmeText).toMatch('test');
  });

  test('should contains last sync information', async () => {
    const versionList = await page.$$('.sidebar-info .detail-info');
    expect(versionList).toHaveLength(1);
  });

  test('should display dependencies tab', async () => {
    const dependenciesTab = await page.$$('#dependencies-tab');
    expect(dependenciesTab).toHaveLength(1);
    await dependenciesTab[0].click({ clickCount: 1, delay: 200 });
    await page.waitFor(1000);
    const tags = await page.$$('.dep-tag');
    const tag = tags[0];
    const label = await page.evaluate(el => el.innerText, tag);
    expect(label).toMatch('verdaccio@');
  });

  test('should display version tab', async () => {
    const versionsTab = await page.$$('#versions-tab');
    expect(versionsTab).toHaveLength(1);
    await versionsTab[0].click({ clickCount: 1, delay: 200 });
    await page.waitFor(1000);
    const versionItems = await page.$$('.version-item');
    expect(versionItems).toHaveLength(2);
  });

  test('should display uplinks tab', async () => {
    const upLinksTab = await page.$$('#uplinks-tab');
    expect(upLinksTab).toHaveLength(1);
    await upLinksTab[0].click({ clickCount: 1, delay: 200 });
    await page.waitFor(1000);
  });

  test('should display readme tab', async () => {
    const readmeTab = await page.$$('#readme-tab');
    expect(readmeTab).toHaveLength(1);
    await readmeTab[0].click({ clickCount: 1, delay: 200 });
    await page.waitFor(1000);
  });

  test('should publish a protected package', async () => {
    await page.goto('http://0.0.0.0:55552');
    await page.waitFor(500);
    await global.__SERVER_PROTECTED__.putPackage(protectedPackageMetadata.name, protectedPackageMetadata);
    await page.waitFor(500);
    await page.reload();
    await page.waitFor(500);
    const text = await page.evaluate(() => document.querySelector('#help-card__title').textContent);
    expect(text).toMatch('No Package Published Yet');
  });

  test('should go to 404 page', async () => {
    await page.goto('http://0.0.0.0:55552/-/web/detail/@verdaccio/not-found');
    await page.waitFor(500);
    const text = await page.evaluate(() => document.querySelector('.not-found-text').textContent);
    expect(text).toMatch("Sorry, we couldn't find it...");
  });
});
