import request from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';

import { validateName, validatePackage } from '../src';
import { getApp } from './helper';

describe('validate package name middleware', () => {
  test.each(['jquery', '-'])('%s should be valid package name', (pkg) => {
    const app = getApp([]);
    app.param('pkg', validatePackage);
    app.get('/:pkg', (_req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get(`/${pkg}`).expect(HTTP_STATUS.OK);
  });

  test.each(['node_modules', '%'])('%s should be invalid package name', (pkg) => {
    const app = getApp([]);
    app.param('pkg', validatePackage);
    app.get('/:pkg', (_req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get(`/${pkg}`).expect(HTTP_STATUS.BAD_REQUEST);
  });

  test('should validate package name double level', async () => {
    const app = getApp([]);
    // @ts-ignore
    app.param('package', validatePackage);
    app.get('/pkg/:package', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/pkg/react').expect(HTTP_STATUS.OK);
  });

  test('should fails validate package name double level', async () => {
    const app = getApp([]);
    // @ts-ignore
    app.param('package', validatePackage);
    app.get('/pkg/:package', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/pkg/node_modules').expect(HTTP_STATUS.BAD_REQUEST);
  });
});

describe('validate file name name middleware', () => {
  test.each(['old-package@0.1.2.tgz', '--0.0.1.tgz'])('%s should be valid file name', (pkg) => {
    const app = getApp([]);
    app.param('pkg', validateName);
    app.get('/:pkg', (_req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get(`/${pkg}`).expect(HTTP_STATUS.OK);
  });

  test.each(['some%2Fthing', '.bin'])('%s should be invalid package name', (pkg) => {
    const app = getApp([]);
    app.param('pkg', validateName);
    app.get('/:pkg', (_req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get(`/${pkg}`).expect(HTTP_STATUS.BAD_REQUEST);
  });

  test('should fails file name package name', async () => {
    const app = getApp([]);
    app.param('filename', validateName);
    app.get('/file/:filename', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/file/__proto__').expect(HTTP_STATUS.BAD_REQUEST);
  });

  test('should validate file name package name', async () => {
    const app = getApp([]);
    app.param('filename', validateName);
    app.get('/file/:filename', (req, res) => {
      res.status(HTTP_STATUS.OK).json({});
    });

    return request(app).get('/file/react.tar.gz').expect(HTTP_STATUS.OK);
  });
});
