// @flow

import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import endPointAPI from '../../../src/api/index';

import {HEADERS, HTTP_STATUS, HEADER_TYPE} from '../../../src/lib/constants';
import {mockServer} from '../__helper/mock';
import {DOMAIN_SERVERS} from '../../functional/config.functional';
import {parseConfigFile} from '../../../src/lib/utils';
import {parseConfigurationFile} from '../__helper';
import {addUser, getPackage} from '../__helper/api';
import {setup} from '../../../src/lib/logger';
import {buildUserBuffer} from '../../../src/lib/auth-utils';

setup([]);
const credentials = { name: 'JotaJWT', password: 'secretPass' };

const parseConfigurationJWTFile = () => {
  return parseConfigurationFile(`api-jwt/jwt`);
};

const FORBIDDEN_VUE: string = 'authorization required to access package vue';

describe('endpoint user auth JWT unit test', () => {
  let app;
  let mockRegistry;

  beforeAll(function(done) {
    const store = path.join(__dirname, '../partials/store/test-jwt-storage');
    const mockServerPort = 55546;
    rimraf(store, async () => {
      const confS = parseConfigFile(parseConfigurationJWTFile());
      const configForTest = _.assign({}, _.cloneDeep(confS), {
        storage: store,
        plinks: {
          npmjs: {
            url: `http://${DOMAIN_SERVERS}:${mockServerPort}`
          }
        },
        self_path: store,
        auth: {
          htpasswd: {
            file: './test-jwt-storage/.htpasswd'
          }
        }
      });
      
      app = await endPointAPI(configForTest);
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function(done) {
    mockRegistry[0].stop();
    done();
  });

  test('should test add a new user with JWT enabled', async (done) => {
    const [err, res] = await addUser(request(app), credentials.name, credentials);
    expect(err).toBeNull();
    expect(res.body.ok).toBeDefined();
    expect(res.body.token).toBeDefined();
    const token = res.body.token;
    expect(typeof token).toBe('string');
    expect(res.body.ok).toMatch(`user '${credentials.name}' created`);
    // testing JWT auth headers with token
    // we need it here, because token is required
    const [err1, resp1] = await getPackage(request(app), `Bearer ${token}`, 'vue');
    expect(err1).toBeNull();
    expect(resp1.body).toBeDefined();
    expect(resp1.body.name).toMatch('vue');

    const [err2, resp2] = await getPackage(request(app), `Bearer fake`, 'vue', HTTP_STATUS.UNAUTHORIZED);
    expect(err2).toBeNull();
    expect(resp2.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(resp2.body.error).toMatch(FORBIDDEN_VUE);
    done();
  });

  test('should emulate npm login when user already exist', async (done) => {
    const credentials = { name: 'jwtUser2', password: 'secretPass' };
    // creates an user
    await addUser(request(app), credentials.name, credentials);
    // it should fails conflict 409
    await addUser(request(app), credentials.name, credentials, HTTP_STATUS.CONFLICT);
    // npm will try to sign in sending credentials via basic auth header
    const token = buildUserBuffer(credentials.name, credentials.password).toString('base64');
    request(app).put(`/-/user/org.couchdb.user:${credentials.name}/-rev/undefined`)
      .send(credentials)
      .set('authorization', `Basic ${token}`)
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.CREATED)
      .end(function(err, res) {
        expect(err).toBeNull();
        expect(res.body.ok).toBeDefined();
        expect(res.body.token).toBeDefined();
        done();
      });
  });

  test('should fails on try to access with corrupted token', async (done) => {
    const [err2, resp2] = await getPackage(request(app), `Bearer fake`, 'vue', HTTP_STATUS.UNAUTHORIZED);
    expect(err2).toBeNull();
    expect(resp2.statusCode).toBe(HTTP_STATUS.UNAUTHORIZED);
    expect(resp2.body.error).toMatch(FORBIDDEN_VUE);
    done();
  });

});
