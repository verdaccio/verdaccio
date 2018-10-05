// @flow

import request from 'supertest';
import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';

import Config from '../../../src/lib/config';
import endPointAPI from '../../../src/api/index';
import {mockServer} from './mock';
import {parseConfigFile} from '../../../src/lib/utils';
import {parseConfigurationFile} from '../__helper';
import {getNewToken, getProfile, postProfile} from './__api-helper';
import {setup} from '../../../src/lib/logger';
import {API_ERROR, HTTP_STATUS} from '../../../src/lib/constants';

setup([]);

const parseConfigurationProfile = () => {
  return parseConfigurationFile(`profile/profile`);
};


describe('endpoint user profile', () => {
  let config;
  let app;
  let mockRegistry;

  beforeAll(function(done) {
    const store = path.join(__dirname, '../partials/store/test-profile-storage');
    const mockServerPort = 55544;
    rimraf(store, async () => {
      const parsedConfig = parseConfigFile(parseConfigurationProfile());
      const configForTest = _.clone(parsedConfig);
      configForTest.storage = store;
      configForTest.auth = {
        htpasswd: {
          file: './test-profile-storage/.htpasswd'
        }
      };
      configForTest.self_path = store;
      config = new Config(configForTest);
      app = await endPointAPI(config);
      mockRegistry = await mockServer(mockServerPort).init();
      done();
    });
  });

  afterAll(function(done) {
    mockRegistry[0].stop();
    done();
  });

  test('should fetch a profile of logged user', async (done) => {
    const credentials = { name: 'JotaJWT', password: 'secretPass' };
    const token = await getNewToken(request(app), credentials);
    const [err1, res1] = await getProfile(request(app), token);
    expect(err1).toBeNull();
    expect(res1.body.name).toBe(credentials.name);
    done();
  });

  test('should forbid to fetch a profile of logged out user', async (done) => {
    const [, resp] = await getProfile(request(app), `fakeToken`, HTTP_STATUS.UNAUTHORIZED);
    expect(resp.error).not.toBeNull();
    expect(resp.error.text).toMatch(API_ERROR.MUST_BE_LOGGED);
    done();
  });

  test('should change password successfully', async (done) => {
    const credentials = { name: 'userTest2000', password: 'secretPass000' };
    const body = {
      password: {
        new: '12345678',
        old: credentials.password,
      }
    };
    const token = await getNewToken(request(app), credentials);
    const [err1, res1] = await postProfile(request(app), body, token);
    expect(err1).toBeNull();
    expect(res1.body.name).toBe(credentials.name);
    done();
  });

  test('should change password is too short', async (done) => {
    const credentials = { name: 'userTest2001', password: 'secretPass001' };
    const body = {
      password: {
        new: 'p1',
        old: credentials.password,
      }
    };
    const token = await getNewToken(request(app), credentials);
    const [, resp] = await postProfile(request(app), body, token, HTTP_STATUS.UNAUTHORIZED);
    expect(resp.error).not.toBeNull();
    expect(resp.error.text).toMatch(API_ERROR.PASSWORD_SHORT());
    done();
  });
});
