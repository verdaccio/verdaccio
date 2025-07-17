import request from '@cypress/request';
import express from 'express';
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';

import { fileUtils } from '@verdaccio/core';

import endPointAPI from '../../../src/api/index';
import { API_ERROR } from '../../../src/lib/constants';
import { setup } from '../../../src/lib/logger';
import config from '../partials/config';

setup({});

const app = express();
const server = require('http').createServer(app);

describe('basic system test', () => {
  let port;
  vi.setConfig({ testTimeout: 20000 });

  beforeAll(async function () {
    await fileUtils.createTempStorageFolder('basic-test');
  });

  beforeAll(async function () {
    const api = await endPointAPI(config());
    app.use(api);

    await new Promise((resolve) => {
      server.listen(0, function () {
        port = server.address().port;
        resolve(true);
      });
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  // TODO: recieve aborted call  [Error: aborted], please review
  test('server should respond on /', () => {
    return new Promise((done) => {
      request(
        {
          url: 'http://localhost:' + port + '/',
          timeout: 6000,
        },
        function (err, res, body) {
          // TEMP: figure out why is flacky, pls remove when is stable.

          console.log('server should respond on / error', err);
          expect(err).toBeNull();
          expect(body).toMatch(/Verdaccio/);
          done(true);
        }
      );
    });
  }, 10000);

  test('server should respond on /___not_found_package', () => {
    return new Promise((done) => {
      request(
        {
          url: `http://localhost:${port}/___not_found_package`,
        },
        function (err, res, body) {
          expect(err).toBeNull();
          expect(body).toMatch(API_ERROR.NO_PACKAGE);
          done(true);
        }
      );
    });
  }, 10000);
});
