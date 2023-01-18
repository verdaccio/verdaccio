import nock from 'nock';
import path from 'path';
import rimraf from 'rimraf';
import request from 'supertest';

import endPointAPI from '../../../../src/api';
import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '../../../../src/lib/constants';
import { DOMAIN_SERVERS } from '../../../functional/config.functional';
import { mockServer } from '../../__helper/mock';
import configDefault from '../../partials/config';

require('../../../../src/lib/logger').setup([{ type: 'stdout', format: 'pretty', level: 'debug' }]);

jest.setTimeout(10000);

describe('endpoint unit test', () => {
  let app;
  const mockServerPort = 55549;
  let mockRegistry;

  beforeAll(function (done) {
    const store = path.join(__dirname, '../../partials/store/test-storage-api-spec');
    rimraf(store, async () => {
      const configForTest = configDefault(
        {
          auth: {
            htpasswd: {
              file: './test-storage-api-spec/.htpasswd',
            },
          },
          filters: {
            '../../modules/api/partials/plugin/filter': {
              pkg: 'npm_test',
              version: '2.0.0',
            },
          },
          storage: store,
          self_path: store,
          uplinks: {
            npmjs: {
              url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
            },
            socketTimeout: {
              url: `http://some.registry.timeout.com`,
              max_fails: 2,
              timeout: '1s',
              fail_timeout: '1s',
            },
          },
          logs: [{ type: 'stdout', format: 'pretty', level: 'warn' }],
        },
        'api.search.spec.yaml'
      );

      app = await endPointAPI(configForTest);
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function (done) {
    mockRegistry[0].stop();
    done();
  });

  afterEach(() => {
    nock.cleanAll();
  });

  describe('should test search api', () => {
    test('should perform a search with results', (done) => {
      const searchAllResponse = require(path.join(__dirname, 'partials', 'search-all.json'));
      const query = '/-/all/since?stale=update_after&startkey=111';
      nock('http://localhost:55549').get(query).reply(200, searchAllResponse);
      request(app)
        .get('/-/all/since?stale=update_after&startkey=111')
        .set('accept-encoding', HEADERS.JSON)
        // this is important, is how the query for all endpoint works
        .set('referer', 'verdaccio')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          if (err) {
            expect(err).toBeNull();
            return done(err);
          }
          expect(res.body).toHaveLength(37);
          done();
        });
    });

    test('should perform a search v1 emtpy results', (done) => {
      const searchV1 = require(path.join(__dirname, 'partials', 'search-v1-empty.json'));
      const query =
        '/-/v1/search?text=verdaccio&size=3&quality=0.65&popularity=0.98&maintenance=0.5';
      jest.spyOn(Date.prototype, 'toUTCString').mockReturnValue('Fri, 14 May 2021 21:29:10 GMT');
      nock('http://localhost:55549').get(query).reply(200, searchV1);
      request(app)
        .get(query)
        .set('accept-encoding', HEADERS.JSON)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          if (err) {
            expect(err).toBeNull();
            return done(err);
          }
          expect(res.body).toStrictEqual({
            objects: [],
            total: 0,
            time: 'Fri, 14 May 2021 21:29:10 GMT',
          });
          done();
        });
    });

    test('should perform a search v1 with results', (done) => {
      const searchV1 = require(path.join(__dirname, 'partials', 'search-v1.json'));
      const query =
        '/-/v1/search?text=verdaccio&size=3&quality=0.65&popularity=0.98&maintenance=0.5';
      jest.spyOn(Date.prototype, 'toUTCString').mockReturnValue('Fri, 14 May 2021 21:29:10 GMT');
      nock('http://localhost:55549').get(query).reply(200, searchV1);
      request(app)
        .get(query)
        .set('accept-encoding', HEADERS.JSON)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          if (err) {
            expect(err).toBeNull();
            return done(err);
          }
          expect(res.body.objects).toBeDefined();
          expect(res.body.time).toBeDefined();
          expect(res.body.total).toEqual(3);
          done();
        });
    });

    test('should perform a search v1 with react forbidden access', (done) => {
      const searchV1 = require(path.join(__dirname, 'partials', 'search-v1-forbidden.json'));
      const query =
        '/-/v1/search?text=verdaccio&size=3&quality=0.65&popularity=0.98&maintenance=0.5';
      jest.spyOn(Date.prototype, 'toUTCString').mockReturnValue('Fri, 14 May 2021 21:29:10 GMT');
      nock('http://localhost:55549').get(query).reply(200, searchV1);
      request(app)
        .get(query)
        .set('accept-encoding', HEADERS.JSON)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          if (err) {
            expect(err).toBeNull();
            return done(err);
          }
          expect(res.body.objects).toBeDefined();
          expect(res.body.time).toBeDefined();
          expect(res.body.total).toEqual(0);
          done();
        });
    });

    test('should perform a search v1 with error', () => {
      const query =
        '/-/v1/search?text=verdaccio&size=3&quality=0.65&popularity=0.98&maintenance=0.5';
      nock('http://localhost:55549').get(query).reply(500);
      return request(app)
        .get(query)
        .set('accept-encoding', HEADERS.JSON)
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .expect(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
    });
  });
});
