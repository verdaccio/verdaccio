import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER, authUtils } from '@verdaccio/core';

import { generatePackageMetadata } from '@verdaccio/test-helper';

import { setup } from '../../../../src/lib/logger';
import { addUser } from '../../__helper/api';
import { createWebApp, seedPackages } from './__helper';

const { buildToken } = authUtils;

setup({});

describe('web endpoints: scope segment validation', () => {
  vi.setConfig({ testTimeout: 10000 });
  let app;
  let mockRegistry;

  beforeAll(async () => {
    // default config: `@protected/*` is only accessible to the `jota_token` user
    ({ app, mockRegistry } = await createWebApp({}, 'htpasswd-web-scope'));
    await seedPackages(app); // seeds @scope/pk1-test, forbidden-place and @protected/pk1
    await request(app)
      .put('/@protected%2fdashboard')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify(generatePackageMetadata('@protected/dashboard')))
      .expect(HTTP_STATUS.CREATED);
  });

  afterAll(() => {
    mockRegistry[0].stop();
  });

  test('a valid "@scope" segment is served (sidebar)', async () => {
    const res = await request(app).get('/-/verdaccio/data/sidebar/@scope/pk1-test');
    expect(res.status).toBe(HTTP_STATUS.OK);
  });

  test('a valid "@scope" segment is served (readme)', async () => {
    const res = await request(app).get('/-/verdaccio/data/package/readme/@scope/pk1-test');
    expect(res.status).toBe(HTTP_STATUS.OK);
  });

  test.each([['scope'], ['qscope'], ['0scope'], ['%20scope']])(
    'a scope segment without "@" is rejected (sidebar, %s)',
    async (scope) => {
      const res = await request(app).get(`/-/verdaccio/data/sidebar/${scope}/pk1-test`);
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    }
  );

  test.each([['scope'], ['qscope'], ['0scope'], ['%20scope']])(
    'a scope segment without "@" is rejected (readme, %s)',
    async (scope) => {
      const res = await request(app).get(`/-/verdaccio/data/package/readme/${scope}/pk1-test`);
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    }
  );

  test.each([['@'], ['@.scope'], ['@sc%20ope'], ['@sc*ope']])(
    'a scope segment that is not a valid npm scope is rejected (sidebar, %s)',
    async (scope) => {
      const res = await request(app).get(`/-/verdaccio/data/sidebar/${scope}/pk1-test`);
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    }
  );

  test.each([['@'], ['@.scope'], ['@sc%20ope'], ['@sc*ope']])(
    'a scope segment that is not a valid npm scope is rejected (readme, %s)',
    async (scope) => {
      const res = await request(app).get(`/-/verdaccio/data/package/readme/${scope}/pk1-test`);
      expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
    }
  );

  describe('access control on scoped packages', () => {
    test('an anonymous request cannot read a protected package (sidebar)', async () => {
      const res = await request(app).get('/-/verdaccio/data/sidebar/@protected/pk1');
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(res.status);
      expect(res.body?.name).toBeUndefined();
    });

    test('an anonymous request cannot read a protected package (readme)', async () => {
      const res = await request(app).get('/-/verdaccio/data/package/readme/@protected/pk1');
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(res.status);
    });

    test.each([['protected'], ['qprotected'], ['0protected']])(
      'a malformed scope segment never resolves to a protected package (sidebar, %s)',
      async (scope) => {
        const res = await request(app).get(`/-/verdaccio/data/sidebar/${scope}/pk1`);
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(res.body?.name).toBeUndefined();
      }
    );

    test.each([['protected'], ['qprotected'], ['0protected']])(
      'a malformed scope segment never resolves to a protected package (readme, %s)',
      async (scope) => {
        const res = await request(app).get(`/-/verdaccio/data/package/readme/${scope}/pk1`);
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
      }
    );

    test('an authorized user can read a protected package (sidebar)', async () => {
      const credentials = { name: 'jota_token', password: 'secretPass' };
      await addUser(request(app), credentials.name, credentials);
      const loginRes = await request(app)
        .post('/-/verdaccio/sec/login')
        .send({ username: credentials.name, password: credentials.password })
        .expect(HTTP_STATUS.OK);
      const res = await request(app)
        .get('/-/verdaccio/data/sidebar/@protected/dashboard')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, loginRes.body.token));
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.latest.name).toBe('@protected/dashboard');
    });
  });

  describe('web login disabled', () => {
    let appNoLogin;
    let mockRegistryNoLogin;

    beforeAll(async () => {
      ({ app: appNoLogin, mockRegistry: mockRegistryNoLogin } = await createWebApp(
        { web: { login: false } },
        'htpasswd-web-scope-nologin'
      ));
      await seedPackages(appNoLogin);
    });

    afterAll(() => {
      mockRegistryNoLogin[0].stop();
    });

    test('an open scoped package is served (sidebar)', async () => {
      const res = await request(appNoLogin).get('/-/verdaccio/data/sidebar/@scope/pk1-test');
      expect(res.status).toBe(HTTP_STATUS.OK);
    });

    test('an open scoped package is served (readme)', async () => {
      const res = await request(appNoLogin).get('/-/verdaccio/data/package/readme/@scope/pk1-test');
      expect(res.status).toBe(HTTP_STATUS.OK);
    });

    test('a protected package stays hidden (sidebar)', async () => {
      const res = await request(appNoLogin).get('/-/verdaccio/data/sidebar/@protected/pk1');
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(res.status);
    });
  });
});
