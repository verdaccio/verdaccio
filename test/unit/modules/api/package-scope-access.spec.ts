import supertest from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { HEADERS, HTTP_STATUS, TOKEN_BEARER, authUtils } from '@verdaccio/core';

import { getNewToken, initializeServer, publishVersion } from './_helper';

const { buildToken } = authUtils;

describe('package access on scoped names', () => {
  let app;

  beforeAll(async () => {
    app = await initializeServer('package-scope-access.yaml');
    await publishVersion(app, '@restricted/webapp', '1.0.0').expect(HTTP_STATUS.CREATED);
    await publishVersion(app, '@team/webapp', '1.0.0').expect(HTTP_STATUS.CREATED);
  });

  test('an anonymous request can read an open scoped package', async () => {
    const response = await supertest(app)
      .get('/@team/webapp')
      .set(HEADERS.ACCEPT, HEADERS.JSON)
      .expect(HTTP_STATUS.OK);
    expect(response.body.name).toBe('@team/webapp');
  });

  test('an anonymous request cannot read a restricted scoped package', async () => {
    const response = await supertest(app)
      .get('/@restricted/webapp')
      .set(HEADERS.ACCEPT, HEADERS.JSON);
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status);
    expect(response.body?.name).toBeUndefined();
  });

  test('an anonymous request cannot read a restricted scoped package (encoded name)', async () => {
    const response = await supertest(app)
      .get('/@restricted%2fwebapp')
      .set(HEADERS.ACCEPT, HEADERS.JSON);
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status);
    expect(response.body?.name).toBeUndefined();
  });

  test('an anonymous request cannot fetch a restricted tarball', async () => {
    const response = await supertest(app)
      .get('/@restricted/webapp/-/webapp-1.0.0.tgz')
      .set(HEADERS.ACCEPT, HEADERS.JSON);
    expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(response.status);
  });

  test('the package name without its scope does not resolve to the scoped package', async () => {
    const response = await supertest(app).get('/webapp').set(HEADERS.ACCEPT, HEADERS.JSON);
    expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
    expect(response.body?.name).toBeUndefined();
  });

  test('an authorized user can read a restricted scoped package', async () => {
    const token = await getNewToken(app, { name: 'maintainer', password: 'strongPass123' });
    const response = await supertest(app)
      .get('/@restricted/webapp')
      .set(HEADERS.ACCEPT, HEADERS.JSON)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .expect(HTTP_STATUS.OK);
    expect(response.body.name).toBe('@restricted/webapp');
  });
});
