import path from 'path';
import request from 'supertest';

import { HEADERS, HTTP_STATUS, HEADER_TYPE, DIST_TAGS } from '@verdaccio/commons-api';

import { mockServer, DOMAIN_SERVERS, configExample, generateRamdonStorage } from '@verdaccio/mock';

import { setup, logger } from '@verdaccio/logger';
import endPointAPI from '../../src';
import forbiddenPlace from './partials/forbidden-place';
import publishMetadata from './partials/publish-api';

setup([]);

describe('endpoint web unit test', () => {
  jest.setTimeout(40000);
  let app;
  let mockRegistry;

  beforeAll(async (done) => {
    const store = generateRamdonStorage();
    const mockServerPort = 55523;
    const configForTest = configExample(
      {
        storage: store,
        config_path: store,
        uplinks: {
          remote: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
          },
        },
      },
      'web.yaml',
      __dirname
    );
    app = await endPointAPI(configForTest);
    const binPath = require.resolve('verdaccio/bin/verdaccio');
    const storePath = path.join(__dirname, '/mock/store');
    mockRegistry = await mockServer(mockServerPort, { storePath, silence: true }).init(binPath);
    done();
  });

  afterAll(function (done) {
    const [registry, pid] = mockRegistry;
    registry.stop();
    logger.info(`registry ${pid} has been stopped`);

    done();
  });

  describe('Registry WebUI endpoints', () => {
    beforeAll(async () => {
      await request(app)
        .put('/@scope%2fpk1-test')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .send(JSON.stringify(publishMetadata))
        .expect(HTTP_STATUS.CREATED);

      await request(app)
        .put('/forbidden-place')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .send(JSON.stringify(forbiddenPlace))
        .expect(HTTP_STATUS.CREATED);
    });

    describe('Packages', () => {
      test('should display sidebar info', (done) => {
        request(app)
          .get('/-/verdaccio/sidebar/@scope/pk1-test')
          .expect(HTTP_STATUS.OK)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .end(function (err, res) {
            // console.log("-->", res);
            // expect(err).toBeNull();

            const sideBarInfo = res.body;
            const latestVersion = publishMetadata.versions[publishMetadata[DIST_TAGS].latest];

            expect(sideBarInfo.latest.author).toBeDefined();
            expect(sideBarInfo.latest.author.avatar).toMatch(/www.gravatar.com/);
            expect(sideBarInfo.latest.author.name).toBe(latestVersion.author.name);
            expect(sideBarInfo.latest.author.email).toBe(latestVersion.author.email);
            done();
          });
      });

      test('should display sidebar info by version', (done) => {
        request(app)
          .get('/-/verdaccio/sidebar/@scope/pk1-test?v=1.0.6')
          .expect(HTTP_STATUS.OK)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .end(function (err, res) {
            const sideBarInfo = res.body;
            const latestVersion = publishMetadata.versions[publishMetadata[DIST_TAGS].latest];

            expect(sideBarInfo.latest.author).toBeDefined();
            expect(sideBarInfo.latest.author.avatar).toMatch(/www.gravatar.com/);
            expect(sideBarInfo.latest.author.name).toBe(latestVersion.author.name);
            expect(sideBarInfo.latest.author.email).toBe(latestVersion.author.email);
            done();
          });
      });

      test('should display sidebar info 404', (done) => {
        request(app)
          .get('/-/verdaccio/sidebar/@scope/404')
          .expect(HTTP_STATUS.NOT_FOUND)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .end(function () {
            done();
          });
      });

      test('should display sidebar info 404 with version', (done) => {
        request(app)
          .get('/-/verdaccio/sidebar/@scope/pk1-test?v=0.0.0-not-found')
          .expect(HTTP_STATUS.NOT_FOUND)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
          .end(function () {
            done();
          });
      });
    });

    describe('Search', () => {
      test('should not find forbidden-place', (done) => {
        request(app)
          .get('/-/verdaccio/search/forbidden-place')
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            // this is expected since we are not logged
            // and  forbidden-place is allow_access: 'nobody'
            expect(res.body).toHaveLength(0);
            done();
          });
      });
    });
  });
});
