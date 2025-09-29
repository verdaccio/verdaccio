import getPort from 'get-port';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';
import {
  API_ERROR,
  DIST_TAGS,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BEARER,
} from '@verdaccio/core';
import { generatePackageMetadata } from '@verdaccio/test-helper';
import { buildToken } from '@verdaccio/utils';

import endPointAPI from '../../../../src/api';
import { setup } from '../../../../src/lib/logger';
import { addUser, getNewToken } from '../../__helper/api';
import { mockServer } from '../../__helper/mock';
import configDefault from '../../partials/config';
import forbiddenPlace from '../../partials/forbidden-place';
import publishMetadata from '../../partials/publish-api';

setup({});

const credentials = { name: 'user-web', password: 'secretPass' };
describe('endpoint web unit test', () => {
  vi.setConfig({ testTimeout: 10000 });
  let app;
  let mockRegistry;

  beforeAll(async function () {
    const store = await fileUtils.createTempStorageFolder('htpasswd-web-api');
    const mockServerPort = await getPort();

    const configForTest = configDefault(
      {
        auth: {
          htpasswd: {
            file: './htpasswd-web-api',
          },
        },
        storage: store,
        uplinks: {
          npmjs: {
            url: `http://localhost:${mockServerPort}`,
          },
        },
        self_path: store,
      },
      'api.web.spec.yaml'
    );
    app = await endPointAPI(configForTest);
    mockRegistry = await mockServer(mockServerPort).init();
  });

  afterAll(function () {
    mockRegistry[0].stop();
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
      await request(app)
        .put('/@protected/pk1')
        .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
        .send(JSON.stringify(generatePackageMetadata('@protected/pk1')))
        .expect(HTTP_STATUS.CREATED);
    });

    describe('Packages', () => {
      test('should display packages without login', async () => {
        // this packages is protected at the yaml file
        const res = await request(app).get('/-/verdaccio/data/packages').expect(HTTP_STATUS.OK);
        expect(res.body).toHaveLength(1);
      });

      test.skip('should display all packages logged', async () => {
        const token = await getNewToken(app, { name: 'jota_token', password: 'secretPass' });
        // this packages is protected at the yaml file
        const res = await request(app)
          .get('/-/verdaccio/data/packages')
          .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
          .expect(HTTP_STATUS.OK);
        expect(res.body).toHaveLength(2);
      });

      test('should display scoped readme', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/package/readme/@scope/pk1-test')
            .expect(HTTP_STATUS.OK)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_CHARSET)
            .end(function (err, res) {
              expect(res.text).toMatch('# test');
              done(true);
            });
        });
      });

      // FIXME: disabled, we need to inspect why fails randomly
      test('should display scoped readme 404', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/package/readme/@scope/404')
            .expect(HTTP_STATUS.OK)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_CHARSET)
            .end(function (err, res) {
              expect(res.body.error).toMatch(API_ERROR.NO_PACKAGE);
              done(true);
            });
        });
      });

      test('should display sidebar info', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/sidebar/@scope/pk1-test')
            .expect(HTTP_STATUS.OK)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .end(function (err, res) {
              const sideBarInfo = res.body;
              const latestVersion = publishMetadata.versions[publishMetadata[DIST_TAGS].latest];

              expect(sideBarInfo.latest.author).toBeDefined();
              expect(sideBarInfo.latest.author.avatar).toMatch(/www.gravatar.com/);
              expect(sideBarInfo.latest.author.name).toBe(latestVersion.author.name);
              expect(sideBarInfo.latest.author.email).toBe(latestVersion.author.email);
              done(true);
            });
        });
      });

      test('should display sidebar info by version', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/sidebar/@scope/pk1-test?v=1.0.6')
            .expect(HTTP_STATUS.OK)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .end(function (err, res) {
              const sideBarInfo = res.body;
              const latestVersion = publishMetadata.versions[publishMetadata[DIST_TAGS].latest];

              expect(sideBarInfo.latest.author).toBeDefined();
              expect(sideBarInfo.latest.author.avatar).toMatch(/www.gravatar.com/);
              expect(sideBarInfo.latest.author.name).toBe(latestVersion.author.name);
              expect(sideBarInfo.latest.author.email).toBe(latestVersion.author.email);
              done(true);
            });
        });
      });

      test('should display sidebar info 404', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/sidebar/@scope/404')
            .expect(HTTP_STATUS.NOT_FOUND)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .end(function () {
              done(true);
            });
        });
      });

      test('should display sidebar info 404 with version', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/sidebar/@scope/pk1-test?v=0.0.0-not-found')
            .expect(HTTP_STATUS.NOT_FOUND)
            .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
            .end(function () {
              done(true);
            });
        });
      });
    });

    describe('Search', () => {
      test('should search pk1-test', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/search/scope')
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              expect(res.body).toHaveLength(1);
              done(true);
            });
        });
      });

      test('should search with 404', async () => {
        const res = await request(app).get('/-/verdaccio/data/search/%40').expect(HTTP_STATUS.OK);
        expect(res.body).toEqual([]);
      });

      test('should not find forbidden-place', () => {
        return new Promise((done) => {
          request(app)
            .get('/-/verdaccio/data/search/forbidden-place')
            .expect(HTTP_STATUS.OK)
            .end(function (err, res) {
              // this is expected since we are not logged
              // and  forbidden-place is allow_access: 'nobody'
              expect(res.body).toHaveLength(0);
              done(true);
            });
        });
      });
    });

    describe('User', () => {
      beforeAll(async () => {
        await addUser(request(app), credentials.name, credentials);
      });

      describe('login webui', () => {
        test('should log successfully', () => {
          return new Promise((done) => {
            request(app)
              .post('/-/verdaccio/sec/login')
              .send({
                username: credentials.name,
                password: credentials.password,
              })
              .expect(HTTP_STATUS.OK)
              .end(function (err, res) {
                expect(res.body.error).toBeUndefined();
                expect(res.body.token).toBeDefined();
                expect(res.body.token).toBeTruthy();
                expect(res.body.username).toMatch(credentials.name);
                expect(res.get(HEADERS.CACHE_CONTROL)).toEqual('no-cache, no-store');
                done(true);
              });
          });
        });

        test('should fails on log unvalid user', () => {
          return new Promise((done) => {
            request(app)
              .post('/-/verdaccio/sec/login')
              .send({
                username: 'fake',
                password: 'fake',
              })
              // FIXME: there should be 401
              .expect(HTTP_STATUS.OK)
              .end(function (err, res) {
                expect(res.body.error).toMatch(/bad username\/password, access denied/);
                done(true);
              });
          });
        });
      });
    });
  });
});
