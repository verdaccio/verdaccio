import request from 'supertest';

import { HTTP_STATUS } from '@verdaccio/core';

import { match } from '../src';
import { getApp } from './helper';

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
