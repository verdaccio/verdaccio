import supertest from 'supertest';
import _ from 'lodash';

import {
  getBadRequest,
  getConflict,
  getUnauthorized,
  HEADERS,
  HEADER_TYPE,
  API_MESSAGE,
  HTTP_STATUS,
  API_ERROR,
} from '@verdaccio/commons-api';

import { $RequestExtend, $ResponseExtend } from '../../types/custom';
import { initializeServer } from './_helper';

const mockApiJWTmiddleware = jest.fn(
  () =>
    (req: $RequestExtend, res: $ResponseExtend, _next): void => {
      req.remote_user = { name: 'test', groups: [], real_groups: [] };
      _next();
    }
);

const mockAuthenticate = jest.fn(() => (_name, _password, callback): void => {
  return callback(null, ['all']);
});

const mockAddUser = jest.fn(() => (_name, _password, callback): void => {
  return callback(getConflict(API_ERROR.USERNAME_ALREADY_REGISTERED));
});

jest.mock('@verdaccio/auth', () => ({
  getApiToken: () => 'token',
  Auth: class {
    apiJWTmiddleware() {
      return mockApiJWTmiddleware();
    }
    allow_access(_d, f_, cb) {
      cb(null, true);
    }
    add_user(name, password, callback) {
      mockAddUser()(name, password, callback);
    }
    authenticate(_name, _password, callback) {
      mockAuthenticate()(_name, _password, callback);
    }
  },
}));

describe('user', () => {
  const credentials = { name: 'test', password: 'test' };

  test('should test add a new user', async () => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () =>
        (req: $RequestExtend, res: $ResponseExtend, _next): void => {
          req.remote_user = { name: undefined };
          _next();
        }
    );

    mockAddUser.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(null, true);
    });
    const app = await initializeServer('user.yaml');
    return new Promise((resolve, reject) => {
      supertest(app)
        .put(`/-/user/org.couchdb.user:newUser`)
        .send({
          name: 'newUser',
          password: 'newUser',
        })
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.CREATED)
        .end(function (err, res) {
          if (err) {
            return reject(err);
          }
          expect(res.body.ok).toBeDefined();
          expect(res.body.token).toBeDefined();
          const token = res.body.token;
          expect(typeof token).toBe('string');
          expect(res.body.ok).toMatch(`user 'newUser' created`);
          resolve(null);
        });
    });
  });

  test('should test fails on add a existing user with login', async () => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () =>
        (req: $RequestExtend, res: $ResponseExtend, _next): void => {
          req.remote_user = { name: undefined };
          _next();
        }
    );
    const app = await initializeServer('user.yaml');
    return new Promise((resolve, reject) => {
      supertest(app)
        .put('/-/user/org.couchdb.user:jotaNew')
        .send(credentials)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.CONFLICT)
        .end(function (err, res) {
          if (err) {
            return reject(err);
          }
          expect(res.body.error).toBeDefined();
          expect(res.body.error).toMatch(API_ERROR.USERNAME_ALREADY_REGISTERED);
          resolve(res.body);
        });
    });
  });

  test('should log in as existing user', async () => {
    const app = await initializeServer('user.yaml');
    return new Promise((resolve, reject) => {
      supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}`)
        .send(credentials)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.CREATED)
        .end((err, res) => {
          if (err) {
            return reject(err);
          }

          expect(res.body).toBeTruthy();
          expect(res.body.ok).toMatch(`you are authenticated as \'${credentials.name}\'`);
          resolve(res);
        });
    });
  });

  test('should test fails add a new user with missing name', async () => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () =>
        (req: $RequestExtend, res: $ResponseExtend, _next): void => {
          req.remote_user = { name: undefined };
          _next();
        }
    );
    mockAddUser.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(getBadRequest(API_ERROR.USERNAME_PASSWORD_REQUIRED));
    });
    const credentialsShort = _.cloneDeep(credentials);
    delete credentialsShort.name;

    const app = await initializeServer('user.yaml');
    return new Promise((resolve, reject) => {
      supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}`)
        .send(credentialsShort)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.BAD_REQUEST)
        .end(function (err, res) {
          if (err) {
            return reject(err);
          }

          expect(res.body.error).toBeDefined();
          expect(res.body.error).toMatch(API_ERROR.USERNAME_PASSWORD_REQUIRED);
          resolve(app);
        });
    });
  });

  test('should test fails add a new user with missing password', async () => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () =>
        (req: $RequestExtend, res: $ResponseExtend, _next): void => {
          req.remote_user = { name: undefined };
          _next();
        }
    );
    const credentialsShort = _.cloneDeep(credentials);
    delete credentialsShort.password;

    const app = await initializeServer('user.yaml');
    return new Promise((resolve, reject) => {
      supertest(app)
        .put(`/-/user/org.couchdb.user:${credentials.name}`)
        .send(credentialsShort)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.BAD_REQUEST)
        .end(function (err, res) {
          if (err) {
            return reject(err);
          }

          expect(res.body.error).toBeDefined();
          // FIXME: message is not 100% accurate
          // eslint-disable-next-line new-cap
          expect(res.body.error).toMatch(API_ERROR.PASSWORD_SHORT());
          resolve(res);
        });
    });
  });

  test('should test fails add a new user with wrong password', async () => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () =>
        (req: $RequestExtend, res: $ResponseExtend, _next): void => {
          req.remote_user = { name: 'test' };
          _next();
        }
    );
    mockAuthenticate.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
    });
    const credentialsShort = _.cloneDeep(credentials);
    credentialsShort.password = 'failPassword';
    const app = await initializeServer('user.yaml');
    return new Promise((resolve, reject) => {
      supertest(app)
        .put('/-/user/org.couchdb.user:test')
        .send(credentialsShort)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.UNAUTHORIZED)
        .end(function (err, res) {
          if (err) {
            return reject(err);
          }

          expect(res.body.error).toBeDefined();
          expect(res.body.error).toMatch(API_ERROR.BAD_USERNAME_PASSWORD);
          resolve(res);
        });
    });
  });

  test('should be able to logout an user', async () => {
    mockApiJWTmiddleware.mockImplementationOnce(
      () =>
        (req: $RequestExtend, _res: $ResponseExtend, _next): void => {
          req.remote_user = { name: 'test' };
          _next();
        }
    );
    mockAuthenticate.mockImplementationOnce(() => (_name, _password, callback): void => {
      return callback(getUnauthorized(API_ERROR.BAD_USERNAME_PASSWORD));
    });
    const credentialsShort = _.cloneDeep(credentials);
    credentialsShort.password = 'failPassword';

    const app = await initializeServer('user.yaml');
    return new Promise((resolve, reject) => {
      supertest(app)
        .delete('/-/user/token/someSecretToken')
        .send(credentialsShort)
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK)
        .end(function (err, res) {
          if (err) {
            return reject(err);
          }

          expect(res.body.ok).toMatch(API_MESSAGE.LOGGED_OUT);
          resolve(res);
        });
    });
  });
});
