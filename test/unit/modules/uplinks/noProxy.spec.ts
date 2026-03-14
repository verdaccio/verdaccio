import { describe, expect, test } from 'vitest';

import { ProxyStorage } from '@verdaccio/proxy';

import { setup } from '../../../../src/lib/logger';

setup({});

const dummyLogger: any = {
  warn: () => {},
  error: () => {},
  info: () => {},
  http: () => {},
  debug: () => {},
};

function setupProxy(host, uplinkConf, appConfig) {
  uplinkConf.url = host;

  return new ProxyStorage('test', uplinkConf, appConfig, dummyLogger);
}

describe('Use proxy', () => {
  test('should work fine without proxy', () => {
    let x = setupProxy('http://x/x', {}, {});

    expect(x.proxy).toEqual(undefined);
  });

  test('local config should take priority', () => {
    let x = setupProxy(
      'http://x/x',
      { http_proxy: 'http://proxy1:8080' },
      { http_proxy: 'http://proxy2:8080' }
    );
    expect(x.proxy).toEqual('http://proxy1:8080');
  });

  test('no_proxy is invalid', () => {
    let x = setupProxy(
      'http://x/x',
      { http_proxy: 'http://proxy:8080', no_proxy: false },
      {}
    );

    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy('http://x/x', { http_proxy: 'http://proxy:8080', no_proxy: null }, {});
    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy('http://x/x', { http_proxy: 'http://proxy:8080', no_proxy: [] }, {});
    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy('http://x/x', { http_proxy: 'http://proxy:8080', no_proxy: '' }, {});
    expect(x.proxy).toEqual('http://proxy:8080');
  });

  test('no_proxy - simple/include', () => {
    let x = setupProxy(
      'http://localhost',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'localhost' }
    );

    expect(x.proxy).toEqual(undefined);
  });

  test('no_proxy - simple/not', () => {
    let x = setupProxy(
      'http://localhost',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'blah' }
    );

    expect(x.proxy).toEqual('http://proxy:8080');
  });

  test('no_proxy - various, single string', () => {
    let x = setupProxy(
      'http://blahblah',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'blah' }
    );

    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy(
      'http://blah.blah',
      {},
      { http_proxy: 'http://proxy:8080', no_proxy: 'blah' }
    );
    expect(x.proxy).toEqual(undefined);
    x = setupProxy(
      'http://blahblah',
      {},
      { http_proxy: 'http://proxy:8080', no_proxy: '.blah' }
    );
    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy(
      'http://blah.blah',
      { http_proxy: 'http://proxy:8080', no_proxy: '.blah' },
      {}
    );
    expect(x.proxy).toEqual(undefined);
    x = setupProxy(
      'http://blah',
      { http_proxy: 'http://proxy:8080', no_proxy: '.blah' },
      {}
    );
    expect(x.proxy).toEqual(undefined);
    x = setupProxy(
      'http://blahh',
      { http_proxy: 'http://proxy:8080', no_proxy: 'blah' },
      {}
    );
    expect(x.proxy).toEqual('http://proxy:8080');
  });

  test('no_proxy - various, array', () => {
    let x = setupProxy(
      'http://blahblah',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'foo,bar,blah' }
    );

    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy(
      'http://blah.blah',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'foo,bar,blah' }
    );
    expect(x.proxy).toEqual(undefined);
    x = setupProxy(
      'http://blah.foo',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'foo,bar,blah' }
    );
    expect(x.proxy).toEqual(undefined);
    x = setupProxy(
      'http://foo.baz',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'foo,bar,blah' }
    );
    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy(
      'http://blahblah',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: ['foo', 'bar', 'blah'] }
    );
    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy(
      'http://blah.blah',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: ['foo', 'bar', 'blah'] }
    );
    expect(x.proxy).toEqual(undefined);
  });

  test('no_proxy - hostport', () => {
    let x = setupProxy(
      'http://localhost:80',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'localhost' }
    );

    expect(x.proxy).toEqual(undefined);
    x = setupProxy(
      'http://localhost:8080',
      { http_proxy: 'http://proxy:8080' },
      { no_proxy: 'localhost' }
    );
    expect(x.proxy).toEqual(undefined);
  });

  test('no_proxy - secure', () => {
    let x = setupProxy('https://something', { http_proxy: 'http://proxy:8080' }, {});

    expect(x.proxy).toEqual(undefined);
    x = setupProxy('https://something', { https_proxy: 'http://proxy:8080' }, {});
    expect(x.proxy).toEqual('http://proxy:8080');
    x = setupProxy(
      'https://something',
      { http_proxy: 'http://proxy1:8080', https_proxy: 'http://proxy2:8080' },
      {}
    );
    expect(x.proxy).toEqual('http://proxy2:8080');
  });
});
