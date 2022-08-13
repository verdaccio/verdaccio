import { printMessage } from '../src/formatter';
import { LevelCode } from '../src/levels';

jest.mock('dayjs', () => ({
  __esModule: true,
  default: () => ({
    format: () => 'formatted-date',
  }),
}));

describe('formatter', () => {
  const prettyfierOptions = { messageKey: 'msg', levelFirst: true, prettyStamp: false };
  describe('printMessage', () => {
    test('should display config file', () => {
      const log = {
        level: 40,
        time: 1585410824129,
        v: 1,
        pid: 27029,
        hostname: 'localhost',
        file: '/Users/user/.config/verdaccio/config/config.yaml',
        msg: 'config file  - @{file}',
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display trace level', () => {
      const log = {
        level: 10,
        foo: 'foo',
        msg: '[trace]  - @{foo}',
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display trace level with pretty stamp', () => {
      const log = {
        level: 10,
        foo: 'foo',
        time: 1585411248203,
        msg: '[trace]  - @{foo}',
      };

      expect(
        printMessage(
          log,
          Object.assign({}, prettyfierOptions, {
            prettyStamp: true,
          }),
          false
        )
      ).toMatchSnapshot();
    });

    test('should display a bytes request', () => {
      const log = {
        level: 35,
        time: 1585411248203,
        v: 1,
        pid: 27029,
        hostname: 'macbook-touch',
        sub: 'in',
        request: { method: 'GET', url: '/verdaccio' },
        user: null,
        remoteIP: '127.0.0.1',
        status: 200,
        error: undefined,
        bytes: { in: 0, out: 150186 },
        msg:
          "@{status}, user: @{user}(@{remoteIP}), req: '@{request.method} @{request.url}', " +
          'bytes: @{bytes.in}/@{bytes.out}',
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display an error request', () => {
      const log = {
        level: 54,
        time: 1585416029123,
        v: 1,
        pid: 30032,
        hostname: 'macbook-touch',
        sub: 'out',
        err: {
          type: 'Error',
          message: 'getaddrinfo ENOTFOUND registry.fake.org',
          stack:
            'Error: getaddrinfo ENOTFOUND registry.fake.org\n' +
            '    at GetAddrInfoReqWrap.onlookup [as oncomplete] (dns.js:60:26)',
          errno: -3008,
          code: 'ENOTFOUND',
          syscall: 'getaddrinfo',
          hostname: 'registry.fake.org',
        },
        request: { method: 'GET', url: 'https://registry.fake.org/aaa' },
        status: 'ERR',
        error: 'getaddrinfo ENOTFOUND registry.fake.org',
        bytes: { in: 0, out: 0 },
        msg: "@{!status}, req: '@{request.method} @{request.url}', error: @{!error}",
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display an fatal request', () => {
      const log = {
        level: 60,
        time: 1585416029123,
        v: 1,
        pid: 30032,
        hostname: 'macbook-touch',
        sub: 'out',
        err: {
          type: 'Error',
          message: 'fatal error',
          stack: '....',
          errno: -3008,
          code: 'ENOTFOUND',
        },
        request: { method: 'GET', url: 'https://registry.fake.org/aaa' },
        status: 'ERR',
        error: 'fatal error',
        bytes: { in: 0, out: 0 },
        msg: "@{!status}, req: '@{request.method} @{request.url}', error: @{!error}",
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display a streaming request', () => {
      const log = {
        level: 35,
        time: 1585411247920,
        v: 1,
        pid: 27029,
        hostname: 'macbook-touch',
        sub: 'out',
        request: { method: 'GET', url: 'https://registry.npmjs.org/verdaccio' },
        status: 304,
        msg: "@{!status}, req: '@{request.method} @{request.url}' (streaming)",
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display version and http address', () => {
      const log = {
        level: 40,
        time: 1585410824322,
        v: 1,
        pid: 27029,
        hostname: 'macbook-touch',
        addr: 'http://localhost:4873/',
        version: 'verdaccio/5.0.0',
        msg: 'http address - @{addr} - @{version}',
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display custom log message', () => {
      const level: LevelCode = 15;
      const log = {
        level,
        something: 'foo',
        msg: 'custom - @{something} - @{missingParam}',
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });

    test('should display a resource request', () => {
      const log = {
        level: 30,
        time: 1585411247622,
        v: 1,
        pid: 27029,
        hostname: 'macbook-touch',
        sub: 'in',
        req: {
          id: undefined,
          method: 'GET',
          url: '/verdaccio',
          headers: {
            connection: 'keep-alive',
            'user-agent': 'npm/6.13.2 node/v13.1.0 darwin x64',
            'npm-in-ci': 'false',
            'npm-scope': '',
            'npm-session': 'afebb4748178bd4b',
            referer: 'view verdaccio',
            'pacote-req-type': 'packument',
            'pacote-pkg-id': 'registry:verdaccio',
            accept: 'application/json',
            authorization: '<Classified>',
            'if-none-match': '"fd6440ba2ad24681077664d8f969e5c3"',
            'accept-encoding': 'gzip,deflate',
            host: 'localhost:4873',
          },
          remoteAddress: '127.0.0.1',
          remotePort: 57968,
        },
        ip: '127.0.0.1',
        msg: "@{ip} requested '@{req.method} @{req.url}'",
      };

      expect(printMessage(log, prettyfierOptions, false)).toMatchSnapshot();
    });
  });
});
