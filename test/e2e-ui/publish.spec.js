const { join } = require('path');
const { generatePackageMetadata } = require('@verdaccio/test-helper');
const { fileUtils, HEADERS } = require('@verdaccio/core');
const { parseConfigFile } = require('@verdaccio/config');
const { Registry, ServerQuery } = require('verdaccio');
const { getPackages } = require('./helper');

const protectedPackageMetadata = generatePackageMetadata('pkg-protected', '5.0.5');
const scopedPackageMetadata = generatePackageMetadata('pkg-scoped', '1.0.6');

describe('/ (Verdaccio Page)', () => {
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

  test('should publish a package', async () => {
    const server = new ServerQuery(registry1.getRegistryUrl());
    await server.putPackage(scopedPackageMetadata.name, scopedPackageMetadata, {
      [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
    });
    await page.waitForTimeout(1000);
    await page.reload();
    await page.waitForTimeout(1000);
    const packagesList = await getPackages(page);
    expect(packagesList).toHaveLength(1);
  });
  //

  test('should navigate to the package detail', async () => {
    const packagesList = await getPackages(page);
    const firstPackage = packagesList[0];
    await firstPackage.click({ delay: 200 });
    await page.waitForTimeout(1000);
    const readmeText = await page.evaluate(
      () => document.querySelector('.markdown-body').textContent
    );

    expect(readmeText).toMatch('test');
  });

  test('should contains last sync information', async () => {
    const versionList = await page.$$('.sidebar-info .detail-info');
    expect(versionList).toHaveLength(1);
  });

  test('should display dependencies tab', async () => {
    const dependenciesTab = await page.$$('#dependencies-tab');
    expect(dependenciesTab).toHaveLength(1);
    await dependenciesTab[0].click({ delay: 200 });
    await page.waitForTimeout(1000);
    const tags = await page.$$('.dep-tag');
    const tag = tags[0];
    const label = await page.evaluate((el) => el.innerText, tag);
    expect(label).toMatch('verdaccio@');
  });

  test('should display version tab', async () => {
    const versionsTab = await page.$$('#versions-tab');
    expect(versionsTab).toHaveLength(1);
    await versionsTab[0].click({ delay: 200 });
    await page.waitForTimeout(1000);
    const versionItems = await page.$$('.version-item');
    expect(versionItems).toHaveLength(2);
  });

  test('should display uplinks tab', async () => {
    const upLinksTab = await page.$$('#uplinks-tab');
    expect(upLinksTab).toHaveLength(1);
    await upLinksTab[0].click({ delay: 200 });
    await page.waitForTimeout(1000);
  });

  test('should display readme tab', async () => {
    const readmeTab = await page.$$('#readme-tab');
    expect(readmeTab).toHaveLength(1);
    await readmeTab[0].click({ delay: 200 });
    await page.waitForTimeout(1000);
  });

  test('should publish a second package', async () => {
    await page.goto(`http://0.0.0.0:${registry1.getPort()}`);
    await page.waitForTimeout(500);
    const server = new ServerQuery(registry1.getRegistryUrl());
    await server.putPackage(protectedPackageMetadata.name, protectedPackageMetadata, {
      [HEADERS.AUTHORIZATION]: `Bearer ${registry1.getToken()}`,
    });
    await page.waitForTimeout(500);
    await page.reload();
    await page.waitForTimeout(500);
    const packagesList = await getPackages(page);
    expect(packagesList).toHaveLength(2);
  });
});
