import supertest from 'supertest';

import { HEADERS, HTTP_STATUS } from '@verdaccio/commons-api';

import { $RequestExtend, $ResponseExtend } from '../../types/custom';
import { initializeServer } from './_helper';

const mockApiJWTmiddleware = jest.fn(
  () => (req: $RequestExtend, res: $ResponseExtend, _next): void => {
    req.remote_user = { name: 'foo', groups: [], real_groups: [] };
    _next();
  }
);

jest.mock('@verdaccio/auth', () => ({
  Auth: class {
    apiJWTmiddleware() {
      return mockApiJWTmiddleware();
    }
    allow_access(_d, f_, cb) {
      cb(null, true);
    }
  },
}));

describe('whoami', () => {
  test.skip('should test referer /whoami endpoint', async (done) => {
    return supertest(await initializeServer('whoami.yaml'))
      .get('/whoami')
      .set('referer', 'whoami')
      .expect(HTTP_STATUS.OK)
      .end(done);
  });

  test.skip('should test no referer /whoami endpoint', async (done) => {
    return supertest(await initializeServer('whoami.yaml'))
      .get('/whoami')
      .expect(HTTP_STATUS.NOT_FOUND)
      .end(done);
  });

  test('should return the logged username', async () => {
    return supertest(await initializeServer('whoami.yaml'))
      .get('/-/whoami')
      .set('Accept', HEADERS.JSON)
      .expect('Content-Type', HEADERS.JSON_CHARSET)
      .expect(HTTP_STATUS.OK)
      .then((response) => {
        expect(response.body.username).toEqual('foo');
      });
  });
});
