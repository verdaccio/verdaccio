import request from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';

import { match, validateName, validatePackage } from '../src';
import { getApp } from './helper';

describe('validate params', () => {
  test('should validate package name', async () => {
    const app = getApp([]);
    // @ts-ignore
    app.param('package', validatePackage);
    app.get('/pkg/:package', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/pkg/react').expect(HTTP_STATUS.OK);
  });

  test('should fails validate package name', async () => {
    const app = getApp([]);
    // @ts-ignore
    app.param('package', validatePackage);
    app.get('/pkg/:package', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/pkg/node_modules').expect(HTTP_STATUS.FORBIDDEN);
  });

  test('should fails file name package name', async () => {
    const app = getApp([]);
    // @ts-ignore
    app.param('filename', validateName);
    app.get('/file/:filename', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/file/__proto__').expect(HTTP_STATUS.FORBIDDEN);
  });

  test('should validate file name package name', async () => {
    const app = getApp([]);
    // @ts-ignore
    app.param('filename', validateName);
    app.get('/file/:filename', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/file/react.tar.gz').expect(HTTP_STATUS.OK);
  });
});

describe('match', () => {
  test('should not match middleware', async () => {
    const app = getApp([]);
    app.param('_rev', match(/^-rev$/));
    app.param('org_couchdb_user', match(/^org\.couchdb\.user:/));
    app.get('/-/user/:org_couchdb_user', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    app.use((res: any) => {
      res.status(HTTP_STATUS.INTERNAL_ERROR);
    });

    return request(app).get('/-/user/test').expect(HTTP_STATUS.INTERNAL_ERROR);
  });

  test('should match middleware', async () => {
    const app = getApp([]);
    app.param('_rev', match(/^-rev$/));
    app.get('/-/user/:_rev?', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    app.use((res: any) => {
      res.status(HTTP_STATUS.INTERNAL_ERROR);
    });

    return request(app).get('/-/user/-rev').expect(HTTP_STATUS.OK);
  });
});
