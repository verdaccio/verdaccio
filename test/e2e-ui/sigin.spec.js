const { join } = require('path');
const { fileUtils } = require('@verdaccio/core');
const { parseConfigFile } = require('@verdaccio/config');
const { Registry, ServerQuery } = require('verdaccio');
const { clickElement, logIn } = require('./helper');

describe('sign in user', () => {
  let registry1;
  let page;
  beforeAll(async () => {
    const configProtected = parseConfigFile(join(__dirname, './config/config.yaml'));
    const registry1storage = await fileUtils.createTempStorageFolder('storage-1');
    const protectedRegistry = await Registry.fromConfigToPath({
      ...configProtected,
      storage: registry1storage,
    });
    registry1 = new Registry(protectedRegistry.configPath);
    await registry1.init();

    const query1 = new ServerQuery(registry1.getRegistryUrl());
    await query1.createUser('test', 'test');

    page = await global.__BROWSER__.newPage();
    await page.goto(`http://0.0.0.0:${registry1.getPort()}`);
    // eslint-disable-next-line no-console
    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
  });

  afterAll(async () => {
    await page.close();
    registry1.stop();
  });

  // this might be increased based on the delays included in all test
  jest.setTimeout(20000);

  const evaluateSignIn = async function (matchText = 'Login') {
    const text = await page.evaluate(() => {
      return document.querySelector('button[data-testid="header--button-login"]').textContent;
    });

    expect(text).toMatch(matchText);
  };

  test('should match button Login to sign in', async () => {
    await evaluateSignIn();
  });

  test('should click on sign in button', async () => {
    const signInButton = await page.$('button[data-testid="header--button-login"]');
    await signInButton.click();
    await page.waitForTimeout(1000);
    const signInDialog = await page.$('#login--dialog');
    expect(signInDialog).not.toBeNull();
    const closeButton = await page.$('button[data-testid="close-login-dialog-button"]');
    await closeButton.click();
    await page.waitForTimeout(500);
  });

  test('should log in an user', async () => {
    // we open the dialog
    await logIn(page);
    // verify if logged in
    const accountButton = await page.$('#header--button-account');
    expect(accountButton).toBeDefined();
    // check whether user is logged
    const buttonLogout = await page.$('#logOutDialogIcon');
    expect(buttonLogout).toBeDefined();
  });

  test('should logout an user', async () => {
    await page.waitForTimeout(10000);
    // we assume the user is logged already
    await clickElement(page, '#header--button-account', { delay: 500 });
    await page.waitForTimeout(1000);
    await clickElement(page, '#logOutDialogIcon > span', { delay: 500 });
    await page.waitForTimeout(1000);
    await evaluateSignIn();
  });
});
