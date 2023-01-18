import _ from 'lodash';
import path from 'path';
import rimraf from 'rimraf';
import request from 'supertest';

import endPointAPI from '../../../../src/api';
import {
  API_ERROR,
  HEADERS,
  HEADER_TYPE,
  HTTP_STATUS,
  SUPPORT_ERRORS,
  TOKEN_BEARER,
} from '../../../../src/lib/constants';
import { buildToken } from '../../../../src/lib/utils';
import { DOMAIN_SERVERS } from '../../../functional/config.functional';
import { getNewToken } from '../../__helper/api';
import { mockServer } from '../../__helper/mock';
import configDefault from '../../partials/config';

require('../../../../src/lib/logger').setup([{ type: 'stdout', format: 'pretty', level: 'trace' }]);

const credentials = { name: 'jota_token', password: 'secretPass' };

const generateTokenCLI = async (app, token, payload): Promise<any> => {
  return new Promise((resolve, reject) => {
    request(app)
      .post('/-/npm/v1/tokens')
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .send(JSON.stringify(payload))
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .end(function (err, resp) {
        if (err) {
          return reject([err, resp]);
        }
        resolve([err, resp]);
      });
  });
};

const deleteTokenCLI = async (app, token, tokenToDelete): Promise<any> => {
  return new Promise((resolve, reject) => {
    request(app)
      .delete(`/-/npm/v1/tokens/token/${tokenToDelete}`)
      .set(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON)
      .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
      .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
      .end(function (err, resp) {
        if (err) {
          return reject([err, resp]);
        }
        resolve([err, resp]);
      });
  });
};

describe('endpoint unit test', () => {
  let app;
  let mockRegistry;
  let token;

  beforeAll(function (done) {
    const store = path.join(__dirname, '../../partials/store/test-storage-token-spec');
    const mockServerPort = 55543;
    rimraf(store, async () => {
      const configForTest = configDefault(
        {
          auth: {
            htpasswd: {
              file: './test-storage-token-spec/.htpasswd-token',
            },
          },
          storage: store,
          self_path: store,
          uplinks: {
            npmjs: {
              url: `http://${DOMAIN_SERVERS}:${mockServerPort}`,
            },
          },
          logs: [{ type: 'stdout', format: 'pretty', level: 'trace' }],
        },
        'token.spec.yaml'
      );

      app = await endPointAPI(configForTest);
      mockRegistry = await mockServer(mockServerPort).init();
      token = await getNewToken(request(app), credentials);

      done();
    });
  });

  afterAll(function (done) {
    mockRegistry[0].stop();
    done();
  });

  describe('Registry Token Endpoints', () => {
    test('should list empty tokens', async () => {
      const resp = await request(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      const { objects, urls } = resp.body;
      expect(objects).toHaveLength(0);
      expect(urls.next).toEqual('');
    });

    test('should generate one token', async () => {
      const [, resp] = await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
        cidr_whitelist: [],
      });
      expect(resp.get(HEADERS.CACHE_CONTROL)).toEqual('no-cache, no-store');

      const resp2 = await request(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      const { objects, urls } = resp2.body;
      expect(objects).toHaveLength(1);
      const [tokenGenerated] = objects;
      expect(tokenGenerated.user).toEqual(credentials.name);
      expect(tokenGenerated.readonly).toBeFalsy();
      expect(tokenGenerated.token).toMatch(/.../);
      expect(_.isString(tokenGenerated.created)).toBeTruthy();

      // verdaccio does not support pagination yet
      expect(urls.next).toEqual('');
    });

    // TODO: is not removing tokens
    test.skip('should delete a token', async () => {
      const res = await generateTokenCLI(app, token, {
        password: credentials.password,
        readonly: false,
        cidr_whitelist: [],
      });

      const t = res[1].body.token;

      await deleteTokenCLI(app, token, t);

      const resp = await request(app)
        .get('/-/npm/v1/tokens')
        .set(HEADERS.AUTHORIZATION, buildToken(TOKEN_BEARER, token))
        .expect(HEADER_TYPE.CONTENT_TYPE, HEADERS.JSON_CHARSET)
        .expect(HTTP_STATUS.OK);
      const { objects } = resp.body;
      expect(objects).toHaveLength(0);
    });

    describe('handle errors', () => {
      test('should fail with wrong credentials', async () => {
        try {
          await generateTokenCLI(app, token, {
            password: 'wrongPassword',
            readonly: false,
            cidr_whitelist: [],
          });
        } catch (e) {
          const [err, body] = e;
          expect(err).not.toBeNull();
          expect(body.error).toEqual(API_ERROR.BAD_USERNAME_PASSWORD);
          expect(body.status).toEqual(HTTP_STATUS.UNAUTHORIZED);
        }
      });

      test('should fail if readonly is missing', async () => {
        const res = await generateTokenCLI(app, token, {
          password: credentials.password,
          cidr_whitelist: [],
        });

        expect(res[0]).toBeNull();
        expect(res[1].body.error).toEqual(SUPPORT_ERRORS.PARAMETERS_NOT_VALID);
      });

      test('should fail if cidr_whitelist is missing', async () => {
        const res = await generateTokenCLI(app, token, {
          password: credentials.password,
          readonly: false,
        });

        expect(res[0]).toBeNull();
        expect(res[1].body.error).toEqual(SUPPORT_ERRORS.PARAMETERS_NOT_VALID);
      });
    });
  });
});
