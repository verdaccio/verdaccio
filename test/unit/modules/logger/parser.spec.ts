import { fillInMsgTemplate } from '../../../../src/lib/logger/formatter';
import { LOG_VERDACCIO_ERROR, LOG_VERDACCIO_BYTES } from '../../../../src/api/middleware';
import { HTTP_STATUS } from '@verdaccio/commons-api';

// the following mocks avoid use colors, thus the strings can be matched

jest.mock('kleur', () => {
  // we emulate colors with this pattern color[msg]
  return {
    green: (r) => `g[${r}]`,
    yellow: (r) => `y[${r}]`,
    black: (r) => `b[${r}]`,
    blue: (r) => `bu[${r}]`,
    red: (r) => `r[${r}]`,
    cyan: (r) => `c[${r}]`,
    magenta: (r) => `m[${r}]`,
    white: (r) => `w[${r}]`
  };
});

jest.mock('util', () => {
  // we need to override only one method, but still we need others
  const originalModule = jest.requireActual('util');
  return {
    ...originalModule,
    inspect: (r) => r
  };
});

describe('Logger Parser', () => {
  describe('basic messages', () => {
    test('number object property', () => {
      expect(fillInMsgTemplate('foo:@{foo}', { foo: 1 }, false)).toEqual('foo:1');
    });

    test('string object property', () => {
      expect(fillInMsgTemplate('foo:@{foo}', { foo: 'bar' }, false)).toEqual('foo:bar');
    });

    test('empty message no object property', () => {
      expect(fillInMsgTemplate('foo', undefined, false)).toEqual('foo');
    });

    test('string no object property', () => {
      expect(fillInMsgTemplate('foo', null, false)).toEqual('foo');
    });

    test('string no object property with break line', () => {
      expect(fillInMsgTemplate('foo \n bar', null, false)).toEqual('foo \n bar');
    });

    test('string no object property with colors', () => {
      expect(fillInMsgTemplate('foo', null, true)).toEqual('foo');
    });

    test('string object property with colors', () => {
      expect(fillInMsgTemplate('foo:@{foo}', { foo: 'bar' }, true)).toEqual(`foo:${'g[bar]'}`);
    });
  });

  describe('middleware log messages', () => {
    describe('test errors log', () => {
      const middlewareObject = {
        name: 'verdaccio',
        request: {
          method: 'POST',
          url: '/-/npm/v1/user'
        },
        user: 'userTest2001',
        remoteIP: '::ffff:127.0.0.1',
        status: HTTP_STATUS.UNAUTHORIZED,
        error: 'some error',
        msg:
          "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}', error: @{!error}"
      };

      test('should display error log', () => {
        const expectedErrorMessage = `401, user: userTest2001(::ffff:127.0.0.1), req: 'POST /-/npm/v1/user', error: some error`;
        expect(fillInMsgTemplate(LOG_VERDACCIO_ERROR, middlewareObject, false)).toEqual(
          expectedErrorMessage
        );
      });

      test('should display error log with colors', () => {
        const expectedErrorMessage = `401, user: g[userTest2001](g[::ffff:127.0.0.1]), req: 'g[POST] g[/-/npm/v1/user]', error: r[some error]`;
        expect(fillInMsgTemplate(LOG_VERDACCIO_ERROR, middlewareObject, true)).toEqual(
          expectedErrorMessage
        );
      });
    });

    describe('test bytes log', () => {
      const middlewareObject = {
        name: 'verdaccio',
        hostname: 'macbook-touch',
        pid: 85621,
        sub: 'in',
        level: 35,
        request: {
          method: 'PUT',
          url: '/-/user/org.couchdb.user:userTest2002'
        },
        user: 'userTest2002',
        remoteIP: '::ffff:127.0.0.1',
        status: 201,
        error: undefined,
        bytes: { in: 50, out: 405 },
        msg:
          "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}', bytes: @{bytes.in}/@{bytes.out}",
        time: '2019-07-20T11:31:49.939Z',
        v: 0
      };

      test('should display log with bytes', () => {
        expect(fillInMsgTemplate(LOG_VERDACCIO_BYTES, middlewareObject, false)).toEqual(
          `201, user: userTest2002(::ffff:127.0.0.1), req: 'PUT /-/user/org.couchdb.user:userTest2002', bytes: 50/405`
        );
      });

      test('should display log with bytes with colors', () => {
        expect(fillInMsgTemplate(LOG_VERDACCIO_BYTES, middlewareObject, true)).toEqual(
          `201, user: g[userTest2002](g[::ffff:127.0.0.1]), req: 'g[PUT] g[/-/user/org.couchdb.user:userTest2002]', bytes: 50/405`
        );
      });
    });
  });
});
