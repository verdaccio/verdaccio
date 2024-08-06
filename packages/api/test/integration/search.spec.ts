import MockDate from 'mockdate';
import supertest from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';

import { createUser, initializeServer, publishVersionWithToken } from './_helper';

describe('search', () => {
  let app;
  beforeEach(async () => {
    app = await initializeServer('search.yaml');
  });

  describe('search authenticated', () => {
    test.each([['foo']])('should return a foo private package', async (pkg) => {
      const mockDate = '2018-01-14T11:17:40.712Z';
      MockDate.set(mockDate);
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
      expect(response.body).toEqual({
        objects: [
          {
            package: {
              author: {
                email: 'user@domain.com',
                name: 'User NPM',
              },
              date: mockDate,
              description: 'package generated',
              keywords: [],
              links: {
                npm: '',
              },
              maintainers: [
                {
                  email: '',
                  name: 'test',
                },
              ],
              name: pkg,
              publisher: {},
              scope: '',
              version: '1.0.0',
            },
            score: {
              detail: {
                maintenance: 0,
                popularity: 1,
                quality: 1,
              },
              final: 1,
            },
            searchScore: 1,
            verdaccioPkgCached: false,
            verdaccioPrivate: true,
          },
        ],
        time: 'Sun, 14 Jan 2018 11:17:40 GMT',
        total: 1,
      });
    });

    test.each([['@scope/foo']])('should return a scoped foo private package', async (pkg) => {
      const mockDate = '2018-01-14T11:17:40.712Z';
      MockDate.set(mockDate);
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
      expect(response.body).toEqual({
        objects: [
          {
            package: {
              author: {
                email: 'user@domain.com',
                name: 'User NPM',
              },
              date: mockDate,
              description: 'package generated',
              keywords: [],
              links: {
                npm: '',
              },
              maintainers: [
                {
                  email: '',
                  name: 'test',
                },
              ],
              name: pkg,
              publisher: {},
              scope: '@scope',
              version: '1.0.0',
            },
            score: {
              detail: {
                maintenance: 0,
                popularity: 1,
                quality: 1,
              },
              final: 1,
            },
            searchScore: 1,
            verdaccioPkgCached: false,
            verdaccioPrivate: true,
          },
        ],
        time: 'Sun, 14 Jan 2018 11:17:40 GMT',
        total: 1,
      });
    });
  });
  describe('error handling', () => {
    test.todo('should able to abort the request');
  });
});
