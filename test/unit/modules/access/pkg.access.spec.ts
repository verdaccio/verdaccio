import path from 'path';
import { rimrafSync } from 'rimraf';
import request from 'supertest';

import endPointAPI from '../../../../src/api';
import { HEADERS, HTTP_STATUS } from '../../../../src/lib/constants';
import { setup } from '../../../../src/lib/logger';
import { mockRegistry } from '../../__helper/mock';
import configDefault from '../../partials/config';

setup([]);

require('../../../../src/lib/logger').setup([]);

describe('api with no limited access configuration', () => {
  let app;

  jest.setTimeout(10000);

  let registry;

  beforeAll(async () => {
    const store = path.join(__dirname, '../../partials/store/access-storage');
    rimrafSync(store);

    registry = await mockRegistry();
    await registry.init();
    const configForTest = configDefault(
      {
        auth: {
          htpasswd: {
            file: './access-storage/htpasswd-pkg-access',
          },
        },
        self_path: store,
        uplinks: {
          remote: {
            url: registry.getRegistryUrl(),
          },
        },
        log: { type: 'stdout', format: 'pretty', level: 'warn' },
      },
      'pkg.access.spec.yaml'
    );
    app = await endPointAPI(configForTest);
  });

  afterAll(function (done) {
    registry.stop();
    done();
  });

  describe('test proxy packages partially restricted', () => {
    test('should test fails on fetch endpoint /-/not-found', (done) => {
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

          done();
        });
    });

    test('should test fetch endpoint /-/jquery', (done) => {
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

          done();
        });
    });

    test('should success on fetch endpoint /-/vue', (done) => {
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

          done();
        });
    });
  });
});
