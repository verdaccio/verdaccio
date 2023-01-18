import express from 'express';
import request from 'request';
import rimraf from 'rimraf';

import endPointAPI from '../../../src/api/index';
import { API_ERROR } from '../../../src/lib/constants';
import { setup } from '../../../src/lib/logger';
import config from '../partials/config/index';

setup([{ type: 'stdout', format: 'pretty', level: 'trace' }]);

const app = express();
const server = require('http').createServer(app);

describe('basic system test', () => {
  let port;
  jest.setTimeout(20000);

  beforeAll(function (done) {
    rimraf(__dirname + '/store/test-storage', done);
  });

  beforeAll(async function () {
    app.use(await endPointAPI(config()));

    await new Promise((resolve) => {
      server.listen(0, function () {
        port = server.address().port;
        resolve();
      });
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  // TODO: recieve aborted call  [Error: aborted], please review
  test.skip('server should respond on /', (done) => {
    request(
      {
        url: 'http://localhost:' + port + '/',
        timeout: 6000,
      },
      function (err, res, body) {
        // TEMP: figure out why is flacky, pls remove when is stable.
        // eslint-disable-next-line no-console
        console.log('server should respond on / error', err);
        expect(err).toBeNull();
        expect(body).toMatch(/Verdaccio/);
        done();
      }
    );
  }, 10000);

  test('server should respond on /___not_found_package', (done) => {
    request(
      {
        url: `http://localhost:${port}/___not_found_package`,
      },
      function (err, res, body) {
        expect(err).toBeNull();
        expect(body).toMatch(API_ERROR.NO_PACKAGE);
        done();
      }
    );
  }, 10000);
});
