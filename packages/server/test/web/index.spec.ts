import path from 'path';
import request from 'supertest';

import { HEADERS, API_ERROR, HTTP_STATUS, HEADER_TYPE, DIST_TAGS } from '@verdaccio/commons-api';

import {
  addUser,
  mockServer,
  DOMAIN_SERVERS,
  configExample,
  generateRamdonStorage,
} from '@verdaccio/mock';

import { setup, logger } from '@verdaccio/logger';
import endPointAPI from '../../src';
import forbiddenPlace from './partials/forbidden-place';
import publishMetadata from './partials/publish-api';

setup([]);

const credentials = { name: 'user-web', password: 'secretPass' };

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
      test('should display all packages', (done) => {
        request(app)
          .get('/-/verdaccio/packages')
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            expect(res.body).toHaveLength(1);
            done();
          });
      });

      test.skip('should display scoped readme', (done) => {
        request(app)
          .get('/-/verdaccio/package/readme/@scope/pk1-test')
          .expect(HTTP_STATUS.OK)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_CHARSET)
          .end(function (err, res) {
            expect(res.text).toMatch('<h1 id="test">test</h1>\n');
            done();
          });
      });

      // FIXME: disabled, we need to inspect why fails randomly
      test.skip('should display scoped readme 404', (done) => {
        request(app)
          .get('/-/verdaccio/package/readme/@scope/404')
          .expect(HTTP_STATUS.OK)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_CHARSET)
          .end(function (err, res) {
            expect(res.body.error).toMatch(API_ERROR.NO_PACKAGE);
            done();
          });
      });

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
      test('should search pk1-test', (done) => {
        request(app)
          .get('/-/verdaccio/search/scope')
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            expect(res.body).toHaveLength(1);
            done();
          });
      });

      test('should search with 404', (done) => {
        request(app)
          .get('/-/verdaccio/search/@')
          .expect(HTTP_STATUS.OK)
          .end(function (err, res) {
            // in a normal world, the output would be 1
            // https://github.com/verdaccio/verdaccio/issues/345
            // should fix this
            expect(res.body).toHaveLength(0);
            done();
          });
      });

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

    describe('User', () => {
      beforeAll(async () => {
        await addUser(request(app), credentials.name, credentials);
      });

      describe('login webui', () => {
        test('should log successfully', (done) => {
          request(app)
            .post('/-/verdaccio/login')
            .send({
              username: credentials.name,
              password: credentials.password,
            })
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              expect(err).toBeNull();
              expect(res.body.error).toBeUndefined();
              expect(res.body.token).toBeDefined();
              expect(res.body.token).toBeTruthy();
              expect(res.body.username).toMatch(credentials.name);
              done();
            });
        });

        test('should fails on log unvalid user', (done) => {
          request(app)
            .post('/-/verdaccio/login')
            .send(
              JSON.stringify({
                username: 'fake',
                password: 'fake',
              })
            )
            // FIXME: there should be 401
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              expect(res.body.error).toMatch(/bad username\/password, access denied/);
              done();
            });
        });
      });
    });
  });
});
