import path from 'node:path';
import supertest from 'supertest';
import { beforeAll, describe, expect, test, vi } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS, TOKEN_BEARER, authUtils } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';
import { publishVersion } from '@verdaccio/test-helper';

import { initializeServer } from './helper';

const { buildToken } = authUtils;

beforeAll(async () => {
  await setup({});
});

const mockManifest = vi.hoisted(() => vi.fn());
vi.mock('@verdaccio/ui-theme', () => ({ default: (...args: any[]) => mockManifest()(...args) }));

describe('web endpoints: scope segment validation', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue(() => ({
      staticPath: path.join(import.meta.dirname, 'static'),
      manifestFiles: {
        js: ['runtime.js', 'vendors.js', 'main.js'],
      },
      manifest: require('./partials/manifest/manifest.json'),
    }));
  });

  test('a valid "@scope" segment is served (sidebar)', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
    await supertest(app).get('/-/verdaccio/data/sidebar/@scope/pk1-test').expect(HTTP_STATUS.OK);
  });

  test('a valid "@scope" segment is served (readme)', async () => {
    const app = await initializeServer('default-test.yaml');
    await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
    await supertest(app)
      .get('/-/verdaccio/data/package/readme/@scope/pk1-test')
      .expect(HTTP_STATUS.OK);
  });

  test.each([['scope'], ['qscope'], ['0scope'], ['%20scope']])(
    'a scope segment without "@" is rejected (sidebar, %s)',
    async (scope) => {
      const app = await initializeServer('default-test.yaml');
      await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
      await supertest(app)
        .get(`/-/verdaccio/data/sidebar/${scope}/pk1-test`)
        .expect(HTTP_STATUS.NOT_FOUND);
    }
  );

  test.each([['scope'], ['qscope'], ['0scope'], ['%20scope']])(
    'a scope segment without "@" is rejected (readme, %s)',
    async (scope) => {
      const app = await initializeServer('default-test.yaml');
      await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
      await supertest(app)
        .get(`/-/verdaccio/data/package/readme/${scope}/pk1-test`)
        .expect(HTTP_STATUS.NOT_FOUND);
    }
  );

  test.each([['@'], ['@.scope'], ['@sc%20ope'], ['@sc*ope']])(
    'a scope segment that is not a valid npm scope is rejected (sidebar, %s)',
    async (scope) => {
      const app = await initializeServer('default-test.yaml');
      await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
      await supertest(app)
        .get(`/-/verdaccio/data/sidebar/${scope}/pk1-test`)
        .expect(HTTP_STATUS.NOT_FOUND);
    }
  );

  test.each([['@'], ['@.scope'], ['@sc%20ope'], ['@sc*ope']])(
    'a scope segment that is not a valid npm scope is rejected (readme, %s)',
    async (scope) => {
      const app = await initializeServer('default-test.yaml');
      await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
      await supertest(app)
        .get(`/-/verdaccio/data/package/readme/${scope}/pk1-test`)
        .expect(HTTP_STATUS.NOT_FOUND);
    }
  );

  describe('web login disabled', () => {
    test('an open scoped package is served (sidebar)', async () => {
      const app = await initializeServer('scope-access-nologin.yaml');
      await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
      await supertest(app).get('/-/verdaccio/data/sidebar/@scope/pk1-test').expect(HTTP_STATUS.OK);
    });

    test('an open scoped package is served (readme)', async () => {
      const app = await initializeServer('scope-access-nologin.yaml');
      await publishVersion(app, '@scope/pk1-test', '1.0.0', { readme: 'a readme' });
      await supertest(app)
        .get('/-/verdaccio/data/package/readme/@scope/pk1-test')
        .expect(HTTP_STATUS.OK);
    });

    test('a restricted package stays hidden (sidebar)', async () => {
      const app = await initializeServer('scope-access-nologin.yaml');
      await publishVersion(app, '@restricted/dashboard', '1.0.0', { readme: 'a readme' });
      const res = await supertest(app).get('/-/verdaccio/data/sidebar/@restricted/dashboard');
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(res.status);
    });
  });

  describe('access control on scoped packages', () => {
    test('an anonymous request cannot read a restricted package (sidebar)', async () => {
      const app = await initializeServer('scope-access.yaml');
      await publishVersion(app, '@restricted/dashboard', '1.0.0', { readme: 'a readme' });
      const res = await supertest(app).get('/-/verdaccio/data/sidebar/@restricted/dashboard');
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(res.status);
    });

    test('an anonymous request cannot read a restricted package (readme)', async () => {
      const app = await initializeServer('scope-access.yaml');
      await publishVersion(app, '@restricted/dashboard', '1.0.0', { readme: 'a readme' });
      const res = await supertest(app).get(
        '/-/verdaccio/data/package/readme/@restricted/dashboard'
      );
      expect([HTTP_STATUS.UNAUTHORIZED, HTTP_STATUS.FORBIDDEN]).toContain(res.status);
    });

    test.each([['restricted'], ['qrestricted'], ['0restricted']])(
      'a malformed scope segment never resolves to a restricted package (sidebar, %s)',
      async (scope) => {
        const app = await initializeServer('scope-access.yaml');
        await publishVersion(app, '@restricted/dashboard', '1.0.0', { readme: 'a readme' });
        const res = await supertest(app).get(`/-/verdaccio/data/sidebar/${scope}/dashboard`);
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(res.body?.latest).toBeUndefined();
      }
    );

    test.each([['restricted'], ['qrestricted'], ['0restricted']])(
      'a malformed scope segment never resolves to a restricted package (readme, %s)',
      async (scope) => {
        const app = await initializeServer('scope-access.yaml');
        await publishVersion(app, '@restricted/dashboard', '1.0.0', { readme: 'a readme' });
        const res = await supertest(app).get(`/-/verdaccio/data/package/readme/${scope}/dashboard`);
        expect(res.status).toBe(HTTP_STATUS.NOT_FOUND);
        expect(res.text).not.toMatch('a readme');
      }
    );

    test('an authorized user can read a restricted package (sidebar)', async () => {
      const app = await initializeServer('scope-access.yaml');
      await publishVersion(app, '@restricted/dashboard', '1.0.0', { readme: 'a readme' });
      const loginRes = await supertest(app)
        .post('/-/verdaccio/sec/login')
        .send(JSON.stringify({ username: 'test', password: 'test' }))
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HTTP_STATUS.OK);
      const res = await supertest(app)
        .get('/-/verdaccio/data/sidebar/@restricted/dashboard')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, loginRes.body.token));
      expect(res.status).toBe(HTTP_STATUS.OK);
      expect(res.body.latest.name).toBe('@restricted/dashboard');
    });
  });
});
