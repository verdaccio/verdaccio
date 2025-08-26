import getPort from 'get-port';
import request from 'supertest';
import { afterAll, beforeAll, describe, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';

import endPointAPI from '../../../../src/api';
import { HEADERS, HTTP_STATUS } from '../../../../src/lib/constants';
import { setup } from '../../../../src/lib/logger';
import { mockServer } from '../../__helper/mock';
import configDefault from '../../partials/config';

setup({});

describe('api with no limited access configuration', () => {
  let app;
  let mockRegistry;
  let store;
  vi.setConfig({ testTimeout: 20000 });

  beforeAll(async function () {
    store = await fileUtils.createTempStorageFolder('basic-test');
    const mockServerPort = await getPort();

    const configForTest = configDefault(
      {
        storage: store,
        auth: {
          htpasswd: {
            file: './access-storage/htpasswd-pkg-access',
          },
        },
        self_path: store,
        uplinks: {
          remote: {
            url: `http://localhost:${mockServerPort}`,
          },
        },
        log: { type: 'stdout', format: 'pretty', level: 'warn' },
      },
      'pkg.access.spec.yaml'
    );

    app = await endPointAPI(configForTest);
    mockRegistry = await mockServer(mockServerPort).init();
  });

  afterAll(function () {
    mockRegistry[0].stop();
  });

  describe('test proxy packages partially restricted', () => {
    test('should test fails on fetch endpoint /-/not-found', () => {
      return new Promise((done) => {
        request(app)
          // @ts-ignore
          .get('/not-found-for-sure')
          .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADERS.CONTENT_TYPE, /json/)
          .expect(HTTP_STATUS.NOT_FOUND)
          .end(function (err) {
            if (err) {
              return done(err);
            }

            done(true);
          });
      });
    });

    test('should test fetch endpoint /-/jquery', () => {
      return new Promise((done) => {
        request(app)
          // @ts-ignore
          .get('/jquery')
          .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADERS.CONTENT_TYPE, /json/)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              return done(err);
            }

            done(true);
          });
      });
    });

    test('should success on fetch endpoint /-/vue', () => {
      return new Promise((done) => {
        request(app)
          // @ts-ignore
          .get('/vue')
          .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADERS.CONTENT_TYPE, /json/)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              return done(err);
            }

            done(true);
          });
      });
    });
  });
});
