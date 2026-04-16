import request from 'supertest';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import {
  API_ERROR,
  DIST_TAGS,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  TOKEN_BEARER,
} from '@verdaccio/core';
import { buildToken } from '@verdaccio/utils';

import { setup } from '../../../../src/lib/logger';
import { getNewToken } from '../../__helper/api';
import publishMetadata from '../../partials/publish-api';
import { createWebApp, seedPackages } from './__helper';

setup({});

describe('web endpoint: packages', () => {
  vi.setConfig({ testTimeout: 10000 });
  let app;
  let mockRegistry;

  beforeAll(async () => {
    ({ app, mockRegistry } = await createWebApp({}, 'htpasswd-web-packages'));
    await seedPackages(app);
  });

  afterAll(() => {
    mockRegistry[0].stop();
  });

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
