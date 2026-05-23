import { beforeAll, describe, expect, test } from 'vitest';

import { logger, setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src';

beforeAll(async () => {
  await setup({});
});

function getProxyInstance(host, uplinkConf, appConfig) {
  uplinkConf.url = host;
  const uplinkName = host.replace(/^https?:\/\//, '');
  return new ProxyStorage(uplinkName, uplinkConf, appConfig, logger);
}

describe('Use proxy', () => {
  describe('basic tets', () => {
    test('should do not define proxy', () => {
      const x = getProxyInstance('http://fake.verdaccio.org', {}, {});

      expect(x.proxy).toEqual(undefined);
    });

    test('uplink configuration should take priority', () => {
      expect(
        getProxyInstance(
          'http://fake.verdaccio.org',
          { http_proxy: 'http:\\fake.verdaccio.org' },
          { http_proxy: 'fake.verdaccio.org' }
        ).proxy
      ).toEqual('http:\\fake.verdaccio.org');
    });

    test('global configuration should be used', () => {
      expect(
        getProxyInstance(
          'http://fake.verdaccio.org',
          {},
          { http_proxy: 'http://fake.verdaccio.org' }
        ).proxy
      ).toEqual('http://fake.verdaccio.org');
    });
  });

  describe('no_proxy invalid cases', () => {
    test('no_proxy is null', () => {
      const x = getProxyInstance(
        'http://x/x',
        { http_proxy: 'http:\\fake.verdaccio.org', no_proxy: null },
        {}
      );
      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });

    test('no_proxy is empty array', () => {
      const x = getProxyInstance(
        'http://x/x',
        { http_proxy: 'http:\\fake.verdaccio.org', no_proxy: [] },
        {}
      );
      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });

    test('no_proxy is empty object', () => {
      const x = getProxyInstance(
        'http://x/x',
        { http_proxy: 'http:\\fake.verdaccio.org', no_proxy: '' },
        {}
      );
      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });

    test('no_proxy - simple/include', () => {
      const x = getProxyInstance(
        'http://localhost',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: 'localhost' }
      );

      expect(x.proxy).toEqual(undefined);
    });

    test('no_proxy - simple/not', () => {
      const x = getProxyInstance(
        'http://localhost',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: 'blah' }
      );

      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });

    test('no_proxy is boolean', () => {
      const x = getProxyInstance(
        'http://registry.some.domain',
        { http_proxy: 'http:\\fake.verdaccio.org', no_proxy: false },
        {}
      );
      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });
  });

  describe('no_proxy override http_proxy use cases', () => {
    test('no_proxy - various, single string', () => {
      const x = getProxyInstance(
        'http://blahblah',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: 'blah' }
      );

      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });
    test('should disable proxy if match hostname', () => {
      const x = getProxyInstance(
        'http://fake.verdaccio.org',
        {},
        { http_proxy: 'http:\\fake.verdaccio.org', no_proxy: 'fake.verdaccio.org' }
      );
      expect(x.proxy).toEqual(undefined);
    });
    test('should not override http_proxy if domain does not match', () => {
      const x = getProxyInstance(
        'http://blahblah',
        {},
        { http_proxy: 'http://fake.verdaccio.org', no_proxy: '.blah' }
      );
      expect(x.proxy).toEqual('http://fake.verdaccio.org');
    });
    test('should override http_proxy if match domain no_proxy', () => {
      const x = getProxyInstance('http://blah.blah', { http_proxy: '123', no_proxy: '.blah' }, {});
      expect(x.proxy).toEqual(undefined);
    });
    test('should override http_proxy due no_proxy match with hostname', () => {
      const x = getProxyInstance('http://blah', { http_proxy: '123', no_proxy: '.blah' }, {});
      expect(x.proxy).toEqual(undefined);
    });
    test('should not override http_proxy if no_proxy does not match', () => {
      const x = getProxyInstance(
        'http://blahh',
        { http_proxy: 'http://fake.verdaccio.org', no_proxy: 'blah' },
        {}
      );
      expect(x.proxy).toEqual('http://fake.verdaccio.org');
    });
  });
  describe('no_proxy as array of domains', () => {
    test('should not override http_proxy if not match domain', () => {
      const x = getProxyInstance(
        'http://blahblah',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: 'foo,bar,blah' }
      );

      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });
    test('should disable proxy if match domain', () => {
      const x = getProxyInstance(
        'http://blah.blah',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: 'foo,bar,blah' }
      );
      expect(x.proxy).toEqual(undefined);
    });

    test('disable proxy if match domain .foo', () => {
      const x = getProxyInstance(
        'http://blah.foo',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: 'foo,bar,blah' }
      );
      expect(x.proxy).toEqual(undefined);
    });
    test('should not disable http_proxy if not match domain', () => {
      const x = getProxyInstance(
        'http://foo.baz',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: 'foo,bar,blah' }
      );
      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });
    test('no_proxy should not find match no_proxy as array invalid domains', () => {
      const x = getProxyInstance(
        'http://blahblah',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: ['foo', 'bar', 'blah'] }
      );
      expect(x.proxy).toEqual('http:\\fake.verdaccio.org');
    });
    test('no_proxy should find match no_proxy as array valid domains', () => {
      const x = getProxyInstance(
        'http://blah.blah',
        { http_proxy: 'http:\\fake.verdaccio.org' },
        { no_proxy: ['foo', 'bar', 'blah'] }
      );
      expect(x.proxy).toEqual(undefined);
    });
  });

  describe('no_proxy with ports', () => {
    test('no_proxy - hostport', () => {
      let x = getProxyInstance(
        'http://localhost:80',
        { http_proxy: '123' },
        { no_proxy: 'localhost' }
      );

      expect(x.proxy).toEqual(undefined);
      x = getProxyInstance(
        'http://localhost:8080',
        { http_proxy: '123' },
        { no_proxy: 'localhost' }
      );
      expect(x.proxy).toEqual(undefined);
    });
  });

  describe('no_proxy with https match', () => {
    test('should not override if https_proxy is defined', () => {
      const x = getProxyInstance('https://something', { http_proxy: '123' }, {});

      expect(x.proxy).toEqual(undefined);
    });
    test('should define proxy if https_proxy match', () => {
      const x = getProxyInstance(
        'https://something',
        { https_proxy: 'https://fake.verdaccio.org' },
        {}
      );
      expect(x.proxy).toEqual('https://fake.verdaccio.org');
    });
    test('should match https_proxy if https protocol match', () => {
      const x = getProxyInstance(
        'https://something',
        { http_proxy: 'http://fake.verdaccio.org', https_proxy: 'https://fake.verdaccio.org' },
        {}
      );
      expect(x.proxy).toEqual('https://fake.verdaccio.org');
    });
  });
});
