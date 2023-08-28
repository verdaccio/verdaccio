import express from 'express';
import got from 'got-cjs';
import { rimrafSync } from 'rimraf';

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

  beforeAll(function () {
    rimrafSync(__dirname + '/store/test-storage');
  });

  beforeAll(async function () {
    app.use(await endPointAPI(config()));

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

  test('server should respond on /', (done) => {
    got.get('http://localhost:' + port + '/').then((res) => {
      expect(res.body).toMatch('DOCTYPE');
      done();
    });
  }, 10000);

  test('server should respond on /___not_found_package', (done) => {
    got
      .get(`http://localhost:${port}/___not_found_package`, { responseType: 'json' })
      .then((res) => {})
      .catch((err) => {
        expect(err.code).toEqual('ERR_NON_2XX_3XX_RESPONSE');
        done();
      });
  }, 10000);
});
