import supertest from 'supertest';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';

import { API_MESSAGE, HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { getDisTags, initializeServer, publishVersion } from './_helper';

beforeAll(async () => {
  await setup({});
});

const tarballName = (pkg: string) => `${pkg.split('/').pop()}-1.0.0.tgz`;

describe('package names', () => {
  let app;
  beforeEach(async () => {
    app = await initializeServer('distTag.yaml');
  });

  test.each([
    'foo',
    '-build-infra',
    'JSONStream',
    'con',
    'pkg.',
    'a'.repeat(215),
    '@scope/foo',
    '@scope/_foo',
    '@con/foo',
    '@lpt1/foo',
  ])('should publish and serve %s', async (pkg) => {
    await publishVersion(app, pkg, '1.0.0').expect(HTTP_STATUS.CREATED);

    const manifest = await supertest(app)
      .get(`/${encodeURIComponent(pkg)}`)
      .set(HEADERS.ACCEPT, HEADERS.JSON)
      .expect(HTTP_STATUS.OK);
    expect(manifest.body.name).toEqual(pkg);

    const version = await supertest(app)
      .get(`/${encodeURIComponent(pkg)}/1.0.0`)
      .set(HEADERS.ACCEPT, HEADERS.JSON)
      .expect(HTTP_STATUS.OK);
    expect(version.body.version).toEqual('1.0.0');

    await supertest(app)
      .get(`/${encodeURIComponent(pkg)}/-/${tarballName(pkg)}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.OCTET_STREAM)
      .expect(HTTP_STATUS.OK);
  });

  test.each(['_foo', '@secret', 'foo@bar', ' foo', 'node_modules', 'favicon.ico'])(
    'should reject the package name %j',
    async (pkg) => {
      await publishVersion(app, pkg, '1.0.0').expect(HTTP_STATUS.BAD_REQUEST);
      await supertest(app)
        .get(`/${encodeURIComponent(pkg)}`)
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HTTP_STATUS.BAD_REQUEST);
    }
  );

  test.each([
    ['foo', 'aux'],
    ['foo', 'con'],
    ['@scope/foo', 'nul'],
    ['@scope/foo', 'lpt1'],
  ])('should add and remove the dist-tag %s@%s', async (pkg, tag) => {
    await publishVersion(app, pkg, '1.0.0').expect(HTTP_STATUS.CREATED);

    const added = await supertest(app)
      .put(`/${encodeURIComponent(pkg)}/${tag}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify('1.0.0'))
      .expect(HTTP_STATUS.CREATED);
    expect(added.body.ok).toEqual(API_MESSAGE.TAG_ADDED);
    expect((await getDisTags(app, pkg)).body).toEqual({ latest: '1.0.0', [tag]: '1.0.0' });

    const removed = await supertest(app)
      .delete(`/-/package/${encodeURIComponent(pkg)}/dist-tags/${tag}`)
      .expect(HTTP_STATUS.CREATED);
    expect(removed.body.ok).toEqual(API_MESSAGE.TAG_REMOVED);
    expect((await getDisTags(app, pkg)).body).toEqual({ latest: '1.0.0' });
  });
});
