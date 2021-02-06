import supertest from 'supertest';
import express from 'express';
import path from 'path';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { Config, parseConfigFile } from '@verdaccio/config';
import { final, handleError, errorReportingMiddleware } from '@verdaccio/middleware';

import { Storage } from '@verdaccio/store';
import { Auth, IAuth } from '@verdaccio/auth';
import { setup } from '@verdaccio/logger';
import { HEADERS, HEADER_TYPE, HTTP_STATUS, API_ERROR } from '@verdaccio/commons-api';
import routes from '../src';
import { parseHtml } from './partials/htmlParser';
import { initializeServer } from './helper';

setup([]);

const mockManifest = jest.fn();
jest.mock('@verdaccio/ui-theme', () => mockManifest());

const getConf = (conf) => {
  const configPath = path.join(__dirname, 'config', conf);

  return parseConfigFile(configPath);
};

describe('test web server', () => {
  beforeAll(() => {
    mockManifest.mockReturnValue({
      staticPath: path.join(__dirname, 'static'),
      manifest: require('./partials/manifest/manifest.json'),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    mockManifest.mockClear();
  });

  describe('render', () => {
    test('should return the root', async () => {
      return (
        supertest(await initializeServer('default-test.yaml'))
          .get('/')
          .set('Accept', HEADERS.TEXT_HTML)
          // .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML)
          .expect(HTTP_STATUS.OK)
          .then((response) => {
            // eslint-disable-next-line no-console
            // console.log(response.text);
            // eslint-disable-next-line no-console
            // console.log(parseHtml(response.text).querySelectorAll('body').toString());
          })
      );
    });

    test('should return the body for a package detail page', async () => {
      return (
        supertest(await initializeServer('default-test.yaml'))
          .get('/-/web/section/some-package')
          .set('Accept', HEADERS.TEXT_HTML)
          // .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML)
          .expect(HTTP_STATUS.OK)
          .then((response) => {
            // eslint-disable-next-line no-console
            // console.log(response.text);
            // eslint-disable-next-line no-console
            // console.log(parseHtml(response.text).querySelectorAll('body').toString());
          })
      );
    });

    test('should static file not found', async () => {
      return supertest(await initializeServer('default-test.yaml'))
        .get('/-/static/not-found.js')
        .set('Accept', HEADERS.TEXT_HTML)
        .expect(HTTP_STATUS.NOT_FOUND);
    });
    //
    test('should static file found', async () => {
      return supertest(await initializeServer('default-test.yaml'))
        .get('/-/static/main.js')
        .set('Accept', HEADERS.TEXT_HTML)
        .expect(HTTP_STATUS.OK);
    });
  });
});
