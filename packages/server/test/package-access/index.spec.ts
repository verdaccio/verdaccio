import path from 'path';
import request from 'supertest';

import { setup, logger } from '@verdaccio/logger';

setup([]);

import { HEADERS, HTTP_STATUS } from '@verdaccio/commons-api';
import { generateRamdonStorage, mockServer, configExample, DOMAIN_SERVERS } from '@verdaccio/mock';
import endPointAPI from '../../src';

describe('api with no limited access configuration', () => {
  let app;
  let mockRegistry;
  const store = generateRamdonStorage();
  jest.setTimeout(10000);

  beforeAll(async () => {
    const mockServerPort = 55530;
    const configForTest = configExample(
      {
        config_path: store,
        uplinks: {
          remote: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
          },
        },
      },
      'pkg.access.yaml',
      __dirname
    );

    app = await endPointAPI(configForTest);
    const binPath = require.resolve('verdaccio/bin/verdaccio');
    const storePath = path.join(__dirname, '/mock/store');
    mockRegistry = await mockServer(mockServerPort, { storePath, silence: true }).init(binPath);
  });

  afterAll(function () {
    const [registry, pid] = mockRegistry;
    registry.stop();
    logger.info(`registry ${pid} has been stopped`);
  });

  describe('test proxy packages partially restricted', () => {
    test('should test fails on fetch endpoint /-/not-found', () => {
      return new Promise((resolve, reject) => {
        request(app)
          // @ts-ignore
          .get('/not-found-for-sure')
          .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADERS.CONTENT_TYPE, /json/)
          .expect(HTTP_STATUS.NOT_FOUND)
          .end(function (err) {
            if (err) {
              return reject(err);
            }

            resolve(null);
          });
      });
    });

    test('should test fetch endpoint /-/jquery', () => {
      return new Promise((resolve, reject) => {
        request(app)
          // @ts-ignore
          .get('/jquery')
          .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADERS.CONTENT_TYPE, /json/)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              return reject(err);
            }

            resolve(null);
          });
      });
    });

    test('should success on fetch endpoint /-/vue', () => {
      return new Promise((resolve, reject) => {
        request(app)
          // @ts-ignore
          .get('/vue')
          .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .expect(HEADERS.CONTENT_TYPE, /json/)
          .expect(HTTP_STATUS.OK)
          .end(function (err) {
            if (err) {
              return reject(err);
            }

            resolve(null);
          });
      });
    });
  });
});
