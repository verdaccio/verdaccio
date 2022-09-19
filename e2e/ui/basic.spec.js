const { join } = require('path');
const { fileUtils } = require('@verdaccio/core');
const { parseConfigFile } = require('@verdaccio/config');
const { Registry, ServerQuery } = require('verdaccio');

describe('basic functionality', () => {
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

  test('should display title', async () => {
    const text = await page.title();
    await page.waitForTimeout(1000);

    expect(text).toContain('verdaccio-server-e2e');
  });

  test('should match title with no packages published', async () => {
    const text = await page.evaluate(() => document.querySelector('#help-card__title').textContent);
    expect(text).toMatch('No Package Published Yet.');
  });

  test('should match title with first step', async () => {
    const text = await page.evaluate(() => document.querySelector('#help-card').textContent);
    expect(text).toContain(`npm adduser --registry http://0.0.0.0:${registry1.getPort()}`);
  });

  test('should match title with second step', async () => {
    const text = await page.evaluate(() => document.querySelector('#help-card').textContent);
    expect(text).toContain(`npm publish --registry http://0.0.0.0:${registry1.getPort()}`);
  });

  test('should go to 404 page', async () => {
    await page.goto(`http://0.0.0.0:${registry1.getPort()}/-/web/detail/@verdaccio/not-found`);
    await page.waitForTimeout(500);
    const text = await page.evaluate(() => document.querySelector('.not-found-text').textContent);
    expect(text).toMatch("Sorry, we couldn't find it...");
  });
});
