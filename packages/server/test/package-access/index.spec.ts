import path from 'path';
import request from 'supertest';

import {setup, logger} from '@verdaccio/logger'

setup([]);

import { HEADERS, HTTP_STATUS } from '@verdaccio/dev-commons';
import endPointAPI from '@verdaccio/server';

import {generateRamdonStorage, mockServer, configExample, DOMAIN_SERVERS} from '@verdaccio/mock';


describe('api with no limited access configuration', () => {
  let app;
  let mockRegistry;
  const store = generateRamdonStorage();
  jest.setTimeout(10000);

  beforeAll(async (done) => {
    const mockServerPort = 55530;
    const configForTest = configExample({
      self_path: store,
      uplinks: {
        remote: {
          url: `http://${DOMAIN_SERVERS}:${mockServerPort}`
        }
      },
    }, 'pkg.access.yaml', __dirname);

    app = await endPointAPI(configForTest);
    const binPath = require.resolve('verdaccio/bin/verdaccio');
    const storePath = path.join(__dirname, '/mock/store');
    mockRegistry = await mockServer(mockServerPort, { storePath, silence: true }).init(binPath);
    done();
  });


  afterAll(function(done) {
    const [registry, pid] = mockRegistry;
    registry.stop();
    logger.info(`registry ${pid} has been stopped`);

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
        .end(function(err) {
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
        .end(function(err) {
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
        .end(function(err) {
          if (err) {
            return done(err);
          }

          done();
        });
    });
  });

});
