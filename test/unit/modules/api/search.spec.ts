import nock from 'nock';
import supertest from 'supertest';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';

import { createUser, initializeServer, publishVersionWithToken } from './_helper';

describe('search', () => {
  let app;
  beforeEach(async () => {
    app = await initializeServer('search.yaml');
  });

  describe('search authenticated', () => {
    test.each([['foo']])('should return a foo private package', async (pkg) => {
      const res = await createUser(app, 'test', 'test');
      await publishVersionWithToken(app, pkg, '1.0.0', res.body.token);
      // this should not be displayed as part of the search
      await publishVersionWithToken(app, 'private-auth', '1.0.0', res.body.token);
      const response = await supertest(app)
        .get(
          `/-/v1/search?text=${encodeURIComponent(
            pkg
          )}&size=2000&from=0&quality=1&popularity=0.1&maintenance=0.1`
        )
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.objects[0].package).toEqual(
        expect.objectContaining({
          name: 'foo',
          description: 'package generated',
          'dist-tags': {
            latest: '1.0.0',
          },

          maintainers: [
            {
              name: 'User NPM',
              email: 'user@domain.com',
              username: 'User NPM',
            },
          ],
          publisher: {
            username: 'foo',
            email: '',
          },
          author: {
            name: 'User NPM',
            email: 'user@domain.com',
          },
          keywords: [],
          versions: {
            '1.0.0': 'latest',
          },
        })
      );
      expect(response.body.objects[0].score).toEqual(
        expect.objectContaining({
          detail: {
            maintenance: 0,
            popularity: 1,
            quality: 1,
          },
          final: 1,
        })
      );
      expect(response.body.objects[0]).toEqual(
        expect.objectContaining({
          local: true,
        })
      );
      expect(response.body).toEqual(
        expect.objectContaining({
          total: 1,
        })
      );
    });

    test.each([['@scope/foo']])('should return a scoped foo private package', async (pkg) => {
      const res = await createUser(app, 'test', 'test');
      await publishVersionWithToken(app, pkg, '1.0.0', res.body.token);
      // this should not be displayed as part of the search
      await publishVersionWithToken(app, '@private/auth', '1.0.0', res.body.token);
      const response = await supertest(app)
        .get(
          `/-/v1/search?text=${encodeURIComponent(
            pkg
          )}&size=2000&from=0&quality=1&popularity=0.1&maintenance=0.1`
        )
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.objects[0].package).toEqual(
        expect.objectContaining({
          name: '@scope/foo',
          description: 'package generated',
          'dist-tags': {
            latest: '1.0.0',
          },
          license: 'ISC',
          readmeFilename: 'README.md',
          maintainers: [
            {
              name: 'User NPM',
              email: 'user@domain.com',
              username: 'User NPM',
            },
          ],
          publisher: {
            username: 'foo',
            email: '',
          },
          author: {
            name: 'User NPM',
            email: 'user@domain.com',
          },
          keywords: [],
          versions: {
            '1.0.0': 'latest',
          },
        })
      );
      expect(response.body.objects[0].score).toEqual(
        expect.objectContaining({
          detail: {
            maintenance: 0,
            popularity: 1,
            quality: 1,
          },
          final: 1,
        })
      );
      expect(response.body.objects[0]).toEqual(
        expect.objectContaining({
          local: true,
        })
      );
      expect(response.body).toEqual(
        expect.objectContaining({
          total: 1,
        })
      );
    });
  });
  describe('pagination', () => {
    test('should honor the size and from parameters', async () => {
      const res = await createUser(app, 'test', 'test');
      await publishVersionWithToken(app, 'foo-a', '1.0.0', res.body.token);
      await publishVersionWithToken(app, 'foo-b', '1.0.0', res.body.token);
      await publishVersionWithToken(app, 'foo-c', '1.0.0', res.body.token);

      const firstPage = await supertest(app)
        .get('/-/v1/search?text=foo&size=2&from=0')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(firstPage.body.objects).toHaveLength(2);

      const secondPage = await supertest(app)
        .get('/-/v1/search?text=foo&size=2&from=2')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(secondPage.body.objects).toHaveLength(1);

      const names = [...firstPage.body.objects, ...secondPage.body.objects].map(
        (item) => item.package.name
      );
      expect(names.sort()).toEqual(['foo-a', 'foo-b', 'foo-c']);
    });

    test('should fall back to defaults on invalid size and from values', async () => {
      const res = await createUser(app, 'test', 'test');
      await publishVersionWithToken(app, 'foo-a', '1.0.0', res.body.token);

      const response = await supertest(app)
        .get('/-/v1/search?text=foo&size=-1&from=invalid')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      expect(response.body.objects).toHaveLength(1);
    });
  });

  describe('rate limiting', () => {
    test('should reject requests above the configured user rate limit', async () => {
      const app = await initializeServer('search-rate-limit.yaml');
      const searchUrl = '/-/v1/search?text=foo&size=20&from=0';

      await supertest(app).get(searchUrl).set(HEADERS.ACCEPT, HEADERS.JSON).expect(HTTP_STATUS.OK);
      await supertest(app).get(searchUrl).set(HEADERS.ACCEPT, HEADERS.JSON).expect(HTTP_STATUS.OK);
      // third request exceeds `userRateLimit.max: 2` in search-rate-limit.yaml
      await supertest(app).get(searchUrl).set(HEADERS.ACCEPT, HEADERS.JSON).expect(429);
    });
  });

  describe('uplink forwarding', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    test('should forward the clamped size and from values to the uplink', async () => {
      let forwardedPath;
      nock('https://registry.npmjs.org')
        .get(/\/-\/v1\/search/)
        .reply(200, function () {
          forwardedPath = this.req.path;
          return { objects: [], total: 0, time: '' };
        });

      const app = await initializeServer('search-uplink.yaml');
      await supertest(app)
        .get('/-/v1/search?text=clamp-check&size=99999&from=99999')
        .set(HEADERS.ACCEPT, HEADERS.JSON)
        .expect(HTTP_STATUS.OK);

      const forwardedQuery = new URL(forwardedPath, 'https://registry.npmjs.org').searchParams;
      expect(forwardedQuery.get('text')).toBe('clamp-check');
      expect(forwardedQuery.get('size')).toBe('250');
      expect(forwardedQuery.get('from')).toBe('10000');
    });
  });

  describe('error handling', () => {
    test.todo('should able to abort the request');
  });
});
