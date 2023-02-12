import express from 'express';
import { JSDOM } from 'jsdom';
import path from 'path';
import supertest from 'supertest';

import { HEADERS, HEADER_TYPE, HTTP_STATUS } from '@verdaccio/core';
import { setup } from '@verdaccio/logger';

import { webMiddleware } from '../src';
import { getConf } from './_helper';

const pluginOptions = {
  manifestFiles: {
    js: ['runtime.js', 'vendors.js', 'main.js'],
  },
  staticPath: path.join(__dirname, 'static'),
  manifest: require('./partials/manifest/manifest.json'),
};

const initializeServer = (configName: string, middlewares = {}) => {
  const app = express();
  app.use(webMiddleware(getConf(configName), middlewares, pluginOptions));
  return app;
};

setup({});

describe('test web server', () => {
  describe('render', () => {
    describe('output', () => {
      const render = async (config = 'default-test.yaml') => {
        const response = await supertest(initializeServer(config))
          .get('/')
          .set('Accept', HEADERS.TEXT_HTML)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
          .expect(HTTP_STATUS.OK);
        return new JSDOM(response.text, { runScripts: 'dangerously' });
      };

      test('should match render set ui properties', async () => {
        const {
          window: { __VERDACCIO_BASENAME_UI_OPTIONS },
        } = await render('web.yaml');
        expect(__VERDACCIO_BASENAME_UI_OPTIONS).toEqual(
          expect.objectContaining({
            showInfo: true,
            showSettings: true,
            showThemeSwitch: true,
            showFooter: true,
            showSearch: true,
            showDownloadTarball: true,
            darkMode: false,
            url_prefix: '/prefix',
            basename: '/prefix/',
            primaryColor: '#ffffff',
            // FIXME: mock these values, avoid random
            // base: 'http://127.0.0.1:60864/prefix/',
            // version: '6.0.0-6-next.28',
            logoURI: '',
            flags: { changePassword: true },
            login: true,
            pkgManagers: ['pnpm', 'yarn'],
            title: 'verdaccio web',
            scope: '@scope',
            language: 'es-US',
          })
        );
      });

      test.todo('should default title');
      test.todo('should need html cache');
    });

    describe('status', () => {
      test('should return the http status 200 for root', async () => {
        return supertest(await initializeServer('default-test.yaml'))
          .get('/')
          .set('Accept', HEADERS.TEXT_HTML)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
          .expect(HTTP_STATUS.OK);
      });

      test('should return the body for a package detail page', async () => {
        return supertest(await initializeServer('default-test.yaml'))
          .get('/-/web/section/some-package')
          .set('Accept', HEADERS.TEXT_HTML)
          .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.TEXT_HTML_UTF8)
          .expect(HTTP_STATUS.OK);
      });

      test('should static file not found', async () => {
        return supertest(await initializeServer('default-test.yaml'))
          .get('/-/static/not-found.js')
          .set('Accept', HEADERS.TEXT_HTML)
          .expect(HTTP_STATUS.NOT_FOUND);
      });

      test('should static file found', async () => {
        return supertest(await initializeServer('default-test.yaml'))
          .get('/-/static/main.js')
          .set('Accept', HEADERS.TEXT_HTML)
          .expect(HTTP_STATUS.OK);
      });
    });
  });
});
