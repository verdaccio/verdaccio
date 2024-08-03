import { describe, expect, test } from 'vitest';

import { logger, setup } from '@verdaccio/logger';

import { ProxyStorage } from '../src';

setup({});

function getProxyInstance(host, uplinkConf, appConfig) {
  uplinkConf.url = host;

  return new ProxyStorage(uplinkConf, appConfig, logger);
}

describe('Use proxy', () => {
  describe('basic tets', () => {
    test('should do not define proxy', () => {
      const x = getProxyInstance('http://registry.domain.org', {}, {});

      expect(x.proxy).toEqual(undefined);
    });

    test('uplink configuration should take priority', () => {
      expect(
        getProxyInstance(
          'http://registry.domain.org',
          { http_proxy: 'http:\\registry.local.org' },
          { http_proxy: 'registry.domain.org' }
        ).proxy
      ).toEqual('http:\\registry.local.org');
    });

    test('global configuration should be used', () => {
      expect(
        getProxyInstance(
          'http://registry.some.org',
          {},
          { http_proxy: 'http://registry.domain.org' }
        ).proxy
      ).toEqual('http://registry.domain.org');
    });
  });

  describe('no_proxy invalid cases', () => {
    test('no_proxy is null', () => {
      let x = getProxyInstance(
        'http://x/x',
        { http_proxy: 'http:\\registry.local.org', no_proxy: null },
        {}
      );
      expect(x.proxy).toEqual('http:\\registry.local.org');
    });

    test('no_proxy is empty array', () => {
      let x = getProxyInstance(
        'http://x/x',
        { http_proxy: 'http:\\registry.local.org', no_proxy: [] },
        {}
      );
      expect(x.proxy).toEqual('http:\\registry.local.org');
    });

    test('no_proxy is empty object', () => {
      let x = getProxyInstance(
        'http://x/x',
        { http_proxy: 'http:\\registry.local.org', no_proxy: '' },
        {}
      );
      expect(x.proxy).toEqual('http:\\registry.local.org');
    });

    test('no_proxy - simple/include', () => {
      let x = getProxyInstance(
        'http://localhost',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: 'localhost' }
      );

      expect(x.proxy).toEqual(undefined);
    });

    test('no_proxy - simple/not', () => {
      let x = getProxyInstance(
        'http://localhost',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: 'blah' }
      );

      expect(x.proxy).toEqual('http:\\registry.local.org');
    });

    test('no_proxy is boolean', () => {
      let x = getProxyInstance(
        'http://registry.some.domain',
        { http_proxy: 'http:\\registry.local.org', no_proxy: false },
        {}
      );
      expect(x.proxy).toEqual('http:\\registry.local.org');
    });
  });

  describe('no_proxy override http_proxy use cases', () => {
    test('no_proxy - various, single string', () => {
      let x = getProxyInstance(
        'http://blahblah',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: 'blah' }
      );

      expect(x.proxy).toEqual('http:\\registry.local.org');
    });
    test('should disable proxy if match hostname', () => {
      let x = getProxyInstance(
        'http://registry.local.org',
        {},
        { http_proxy: 'http:\\registry.local.org', no_proxy: 'registry.local.org' }
      );
      expect(x.proxy).toEqual(undefined);
    });
    test('should not override http_proxy if domain does not match', () => {
      let x = getProxyInstance(
        'http://blahblah',
        {},
        { http_proxy: 'http://registry.local.org', no_proxy: '.blah' }
      );
      expect(x.proxy).toEqual('http://registry.local.org');
    });
    test('should override http_proxy if match domain no_proxy', () => {
      let x = getProxyInstance('http://blah.blah', { http_proxy: '123', no_proxy: '.blah' }, {});
      expect(x.proxy).toEqual(undefined);
    });
    test('should override http_proxy due no_proxy match with hostname', () => {
      let x = getProxyInstance('http://blah', { http_proxy: '123', no_proxy: '.blah' }, {});
      expect(x.proxy).toEqual(undefined);
    });
    test('should not override http_proxy if no_proxy does not match', () => {
      let x = getProxyInstance(
        'http://blahh',
        { http_proxy: 'http://registry.local.org', no_proxy: 'blah' },
        {}
      );
      expect(x.proxy).toEqual('http://registry.local.org');
    });
  });
  describe('no_proxy as array of domains', () => {
    test('should not override http_proxy if not match domain', () => {
      let x = getProxyInstance(
        'http://blahblah',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: 'foo,bar,blah' }
      );

      expect(x.proxy).toEqual('http:\\registry.local.org');
    });
    test('should disable proxy if match domain', () => {
      let x = getProxyInstance(
        'http://blah.blah',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: 'foo,bar,blah' }
      );
      expect(x.proxy).toEqual(undefined);
    });

    test('disable proxy if match domain .foo', () => {
      let x = getProxyInstance(
        'http://blah.foo',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: 'foo,bar,blah' }
      );
      expect(x.proxy).toEqual(undefined);
    });
    test('should not disable http_proxy if not match domain', () => {
      let x = getProxyInstance(
        'http://foo.baz',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: 'foo,bar,blah' }
      );
      expect(x.proxy).toEqual('http:\\registry.local.org');
    });
    test('no_proxy should not find match no_proxy as array invalid domains', () => {
      let x = getProxyInstance(
        'http://blahblah',
        { http_proxy: 'http:\\registry.local.org' },
        { no_proxy: ['foo', 'bar', 'blah'] }
      );
      expect(x.proxy).toEqual('http:\\registry.local.org');
    });
    test('no_proxy should find match no_proxy as array valid domains', () => {
      let x = getProxyInstance(
        'http://blah.blah',
        { http_proxy: 'http:\\registry.local.org' },
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
      let x = getProxyInstance('https://something', { http_proxy: '123' }, {});

      expect(x.proxy).toEqual(undefined);
    });
    test('should define proxy if https_proxy match', () => {
      let x = getProxyInstance(
        'https://something',
        { https_proxy: 'https://registry.local.org' },
        {}
      );
      expect(x.proxy).toEqual('https://registry.local.org');
    });
    test('should match https_proxy if https protocol match', () => {
      let x = getProxyInstance(
        'https://something',
        { http_proxy: 'http://registry.local.org', https_proxy: 'https://registry.local.org' },
        {}
      );
      expect(x.proxy).toEqual('https://registry.local.org');
    });
  });
});
