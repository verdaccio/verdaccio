import express from 'express';
import fetch from 'node-fetch';
import path from "path";

import {API_ERROR} from '@verdaccio/dev-commons';
import {parseConfigFile} from "@verdaccio/utils";
import { setup } from '@verdaccio/logger';

import endPointAPI from '../../src';

setup([
  {type: 'stdout', format: 'pretty', level: 'trace'}
]);

const app = express();
const server = require('http').createServer(app);

const parseConfigurationFile = (conf) => {
  return path.join(__dirname, `./${conf}`);
};

describe('basic system test', () => {
  let port;
  jest.setTimeout(20000);

  beforeAll(async function(done) {
    const config = parseConfigFile(parseConfigurationFile('basic.yaml'));
    app.use(await endPointAPI(config));
    server.listen(0, function() {
      port = server.address().port;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('server should respond on /', async () => {
    const response = await fetch(`http://localhost:${port}/`);
    const jsonResponse = await response.text();
    expect(jsonResponse).toMatch(/Verdaccio/);
  });

  test('server should respond on /___not_found_package', async () => {
    const response = await fetch(`http://localhost:${port}/___not_found_package`);
    const jsonResponse = await response.json();
    expect(jsonResponse.error).toMatch(API_ERROR.NO_PACKAGE);
  });
});
