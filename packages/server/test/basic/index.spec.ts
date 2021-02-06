import path from 'path';
import express from 'express';
import request from 'request';

import { API_ERROR } from '@verdaccio/commons-api';
import { parseConfigFile } from '@verdaccio/config';
import { setup } from '@verdaccio/logger';

import endPointAPI from '../../src';

setup([{ type: 'stdout', format: 'pretty', level: 'trace' }]);

const app = express();
const server = require('http').createServer(app);

const parseConfigurationFile = (conf) => {
  return path.join(__dirname, `./${conf}`);
};

// TODO: restore when web module is ready
describe.skip('basic system test', () => {
  let port;
  jest.setTimeout(20000);

  beforeAll(async function (done) {
    const config = parseConfigFile(parseConfigurationFile('basic.yaml'));
    app.use(await endPointAPI(config));
    server.listen(0, function () {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('server should respond on /', (done) => {
    request(
      {
        url: 'http://localhost:' + port + '/',
      },
      function (err, res, body) {
        expect(err).toBeNull();
        expect(body).toMatch(/Verdaccio/);
        done();
      }
    );
  });

  test('server should respond on /___not_found_package', (done) => {
    request(
      {
        json: true,
        url: `http://localhost:${port}/___not_found_package`,
      },
      function (err, res, body) {
        expect(err).toBeNull();
        expect(body.error).toMatch(API_ERROR.NO_PACKAGE);
        done();
      }
    );
  });
});
