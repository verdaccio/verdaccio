import { ProxyStorage } from '../src/up-storage';

require('@verdaccio/logger').setup([]);

function setupProxy(host, uplinkConf, appConfig) {
  uplinkConf.url = host;

  return new ProxyStorage(uplinkConf, appConfig);
}

describe('Use proxy', () => {
  test('should work fine without proxy', () => {
    const x = setupProxy('http://x/x', {}, {});

    expect(x.proxy).toEqual(undefined);
  });

  test('local config should take priority', () => {
    const x = setupProxy('http://x/x', { http_proxy: '123' }, { http_proxy: '456' });
    expect(x.proxy).toEqual('123');
  });

  test('no_proxy is invalid', () => {
    let x = setupProxy('http://x/x', { http_proxy: '123', no_proxy: false }, {});

    expect(x.proxy).toEqual('123');
    x = setupProxy('http://x/x', { http_proxy: '123', no_proxy: null }, {});
    expect(x.proxy).toEqual('123');
    x = setupProxy('http://x/x', { http_proxy: '123', no_proxy: [] }, {});
    expect(x.proxy).toEqual('123');
    x = setupProxy('http://x/x', { http_proxy: '123', no_proxy: '' }, {});
    expect(x.proxy).toEqual('123');
  });

  test('no_proxy - simple/include', () => {
    let x = setupProxy('http://localhost', { http_proxy: '123' }, { no_proxy: 'localhost' });

    expect(x.proxy).toEqual(undefined);
  });

  test('no_proxy - simple/not', () => {
    let x = setupProxy('http://localhost', { http_proxy: '123' }, { no_proxy: 'blah' });

    expect(x.proxy).toEqual('123');
  });

  test('no_proxy - various, single string', () => {
    let x = setupProxy('http://blahblah', { http_proxy: '123' }, { no_proxy: 'blah' });

    expect(x.proxy).toEqual('123');
    x = setupProxy('http://blah.blah', {}, { http_proxy: '123', no_proxy: 'blah' });
    expect(x.proxy).toEqual(undefined);
    x = setupProxy('http://blahblah', {}, { http_proxy: '123', no_proxy: '.blah' });
    expect(x.proxy).toEqual('123');
    x = setupProxy('http://blah.blah', { http_proxy: '123', no_proxy: '.blah' }, {});
    expect(x.proxy).toEqual(undefined);
    x = setupProxy('http://blah', { http_proxy: '123', no_proxy: '.blah' }, {});
    expect(x.proxy).toEqual(undefined);
    x = setupProxy('http://blahh', { http_proxy: '123', no_proxy: 'blah' }, {});
    expect(x.proxy).toEqual('123');
  });

  test('no_proxy - various, array', () => {
    let x = setupProxy('http://blahblah', { http_proxy: '123' }, { no_proxy: 'foo,bar,blah' });

    expect(x.proxy).toEqual('123');
    x = setupProxy('http://blah.blah', { http_proxy: '123' }, { no_proxy: 'foo,bar,blah' });
    expect(x.proxy).toEqual(undefined);
    x = setupProxy('http://blah.foo', { http_proxy: '123' }, { no_proxy: 'foo,bar,blah' });
    expect(x.proxy).toEqual(undefined);
    x = setupProxy('http://foo.baz', { http_proxy: '123' }, { no_proxy: 'foo,bar,blah' });
    expect(x.proxy).toEqual('123');
    x = setupProxy('http://blahblah', { http_proxy: '123' }, { no_proxy: ['foo', 'bar', 'blah'] });
    expect(x.proxy).toEqual('123');
    x = setupProxy('http://blah.blah', { http_proxy: '123' }, { no_proxy: ['foo', 'bar', 'blah'] });
    expect(x.proxy).toEqual(undefined);
  });

  test('no_proxy - hostport', () => {
    let x = setupProxy('http://localhost:80', { http_proxy: '123' }, { no_proxy: 'localhost' });

    expect(x.proxy).toEqual(undefined);
    x = setupProxy('http://localhost:8080', { http_proxy: '123' }, { no_proxy: 'localhost' });
    expect(x.proxy).toEqual(undefined);
  });

  test('no_proxy - secure', () => {
    let x = setupProxy('https://something', { http_proxy: '123' }, {});

    expect(x.proxy).toEqual(undefined);
    x = setupProxy('https://something', { https_proxy: '123' }, {});
    expect(x.proxy).toEqual('123');
    x = setupProxy('https://something', { http_proxy: '456', https_proxy: '123' }, {});
    expect(x.proxy).toEqual('123');
  });
});
