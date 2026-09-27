import path from 'node:path';
import supertest from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { generatePackageMetadata, publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';

vi.mock('@verdaccio/ui-theme', () => ({
  default: () => ({
    staticPath: path.join(import.meta.dirname, 'static'),
    manifestFiles: { js: ['runtime.js', 'vendors.js', 'main.js'] },
    manifest: require('./partials/manifest/manifest.json'),
  }),
}));

beforeAll(async () => {
  await setup({});
});

async function search(app, term: string) {
  const response = await supertest(app)
    .get(`/-/verdaccio/data/search/${encodeURIComponent(term)}`)
    .expect(HTTP_STATUS.OK);
  return response.body;
}

describe('indexed web search', () => {
  test.each([
    'web-search-react-buton',
    'WEB-SEARCH-REACT-BUTTON',
    'act-button',
    'accessibility',
    'Persistencia',
  ])('finds a local package by "%s"', async (term) => {
    const app = await initializeServer('default-test.yaml');
    const name = 'web-search-react-button';
    const manifest = generatePackageMetadata(name);
    manifest.versions['1.0.0'].keywords = ['accessibility'];
    manifest.versions['1.0.0'].description = 'Persistencia de datos';
    await publishVersion(app, name, '1.0.0', manifest).expect(HTTP_STATUS.CREATED);

    const results = await search(app, term);
    expect(results.map((item) => item.package.name)).toEqual([name]);
    expect(results[0]).toMatchObject({
      package: { version: '1.0.0', keywords: ['accessibility'] },
      verdaccioPrivate: true,
    });
  });

  test('updates indexed metadata when a new latest version is published', async () => {
    const app = await initializeServer('default-test.yaml');
    const name = 'metadata-package';
    for (const [version, keyword] of [
      ['1.0.0', 'cobaltneutrino'],
      ['2.0.0', 'xylophonezephyr'],
    ]) {
      const manifest = generatePackageMetadata(name, version);
      manifest.versions[version].keywords = [keyword];
      await publishVersion(app, name, version, manifest).expect(HTTP_STATUS.CREATED);
      const results = await search(app, keyword);
      expect(results.map((item) => item.package.version)).toEqual([version]);
    }
    expect(await search(app, 'cobaltneutrino')).toEqual([]);
  });

  test('keeps indexes isolated between registry instances', async () => {
    const first = await initializeServer('default-test.yaml');
    const second = await initializeServer('default-test.yaml');
    const name = 'instance-package';
    const manifest = generatePackageMetadata(name);
    manifest.versions['1.0.0'].keywords = ['cobaltneutrino'];
    await publishVersion(first, name, '1.0.0', manifest).expect(HTTP_STATUS.CREATED);

    expect((await search(first, 'cobaltneutrino')).map((item) => item.package.name)).toEqual([
      name,
    ]);
    expect(await search(second, 'cobaltneutrino')).toEqual([]);
  });

  test('checks access before applying the twenty-result limit', async () => {
    const app = await initializeServer('search-fuse.yaml');
    for (let i = 0; i < 21; i++) {
      await publishVersion(app, `blocked-quasar-${i}`, '1.0.0').expect(HTTP_STATUS.CREATED);
    }
    const manifest = generatePackageMetadata('visible-package');
    manifest.versions['1.0.0'].keywords = ['quasar'];
    await publishVersion(app, 'visible-package', '1.0.0', manifest).expect(HTTP_STATUS.CREATED);

    expect((await search(app, 'quasar')).map((item) => item.package.name)).toEqual([
      'visible-package',
    ]);
  });
});
