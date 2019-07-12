import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import { setup } from '../../../../src/lib/logger';

setup([]);

import { HEADERS, HTTP_STATUS } from '../../../../src/lib/constants';
import configDefault from '../../partials/config/config_access';
import endPointAPI from '../../../../src/api';
import {mockServer} from '../../__helper/mock';
import {DOMAIN_SERVERS} from '../../../functional/config.functional';

require('../../../../src/lib/logger').setup([]);

describe('api with no limited access configuration', () => {
  let app;
  let mockRegistry;
  const store = path.join(__dirname, '../../partials/store/access-storage');

  beforeAll(function(done) {
    const mockServerPort = 55530;
    // jest.setTimeout(100000000);

    rimraf(store, async () => {
      const configForTest = _.assign({}, _.cloneDeep(configDefault), {
        auth: {
          htpasswd: {
            file: './access-storage/htpasswd-pkg-access'
          }
        },
        self_path: store,
        uplinks: {
          npmjs: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`
          }
        }
      });

      app = await endPointAPI(configForTest);
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function(done) {
    rimraf(store, (err) => {
      if (err) {
        mockRegistry[0].stop();
        return done(err);
      }

      mockRegistry[0].stop();
      return done();
    });
  });

  describe('test proxy packages partially restricted', () => {

    test('should test fails on fetch endpoint /-/jquery', (done) => {
      request(app)
        .get('/jquery')
        .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HEADERS.CONTENT_TYPE, /json/)
        .expect(HTTP_STATUS.NOT_FOUND)
        .end(function(err) {
          if (err) {
            return done(err);
          }

          done();
        });
    });

    test('should success on fetch endpoint /-/vue', (done) => {
      request(app)
        .get('/vue')
        .set(HEADERS.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HEADERS.CONTENT_TYPE, /json/)
        .expect(HTTP_STATUS.OK)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          done();
        });
    });
  });

});
