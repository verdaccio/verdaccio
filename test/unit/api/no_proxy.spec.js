import assert from 'assert';
import Storage from '../../../src/lib/up-storage';

require('../../../src/lib/logger').setup([]);

function setupProxy(host, config, mainconfig) {
  config.url = host;
  return new Storage(config, mainconfig);
}

describe('Use proxy', () => {
  test('should work fine without proxy', () => {
    let x = setupProxy('http://x/x', {}, {});
    assert.equal(x.proxy, null);
  });

  test('local config should take priority', () => {
    let x = setupProxy('http://x/x', {http_proxy: '123'}, {http_proxy: '456'});
    assert.equal(x.proxy, '123');
  });

  test('no_proxy is invalid', () => {
    let x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: false}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: null}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: []}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: ''}, {});
    assert.equal(x.proxy, '123');
  });

  test('no_proxy - simple/include', () => {
    let x = setupProxy('http://localhost', {http_proxy: '123'}, {no_proxy: 'localhost'});
    assert.equal(x.proxy, undefined);
  });

  test('no_proxy - simple/not', () => {
    let x = setupProxy('http://localhost', {http_proxy: '123'}, {no_proxy: 'blah'});
    assert.equal(x.proxy, '123');
  });

  test('no_proxy - various, single string', () => {
    let x = setupProxy('http://blahblah', {http_proxy: '123'}, {no_proxy: 'blah'});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://blah.blah', {}, {http_proxy: '123', no_proxy: 'blah'});
    assert.equal(x.proxy, null);
    x = setupProxy('http://blahblah', {}, {http_proxy: '123', no_proxy: '.blah'});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://blah.blah', {http_proxy: '123', no_proxy: '.blah'}, {});
    assert.equal(x.proxy, null);
    x = setupProxy('http://blah', {http_proxy: '123', no_proxy: '.blah'}, {});
    assert.equal(x.proxy, null);
    x = setupProxy('http://blahh', {http_proxy: '123', no_proxy: 'blah'}, {});
    assert.equal(x.proxy, '123');
  });

  test('no_proxy - various, array', () => {
    let x = setupProxy('http://blahblah', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://blah.blah', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
    assert.equal(x.proxy, null);
    x = setupProxy('http://blah.foo', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
    assert.equal(x.proxy, null);
    x = setupProxy('http://foo.baz', {http_proxy: '123'}, {no_proxy: 'foo,bar,blah'});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://blahblah', {http_proxy: '123'}, {no_proxy: ['foo', 'bar', 'blah']});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://blah.blah', {http_proxy: '123'}, {no_proxy: ['foo', 'bar', 'blah']});
    assert.equal(x.proxy, null);
  });

  test('no_proxy - hostport', () => {
    let x = setupProxy('http://localhost:80', {http_proxy: '123'}, {no_proxy: 'localhost'});
    assert.equal(x.proxy, null);
    x = setupProxy('http://localhost:8080', {http_proxy: '123'}, {no_proxy: 'localhost'});
    assert.equal(x.proxy, null);
  });

  test('no_proxy - secure', () => {
    let x = setupProxy('https://something', {http_proxy: '123'}, {});
    assert.equal(x.proxy, null);
    x = setupProxy('https://something', {https_proxy: '123'}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('https://something', {http_proxy: '456', https_proxy: '123'}, {});
    assert.equal(x.proxy, '123');
  });
});
