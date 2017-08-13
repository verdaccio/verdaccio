'use strict';

let assert = require('assert');
let Storage = require('../../src/lib/up-storage');

require('../../src/lib/logger').setup([]);

function setupProxy(host, config, mainconfig) {
  config.url = host;
  return new Storage(config, mainconfig);
}

describe('Use proxy', function() {
  it('should work fine without proxy', function() {
    let x = setupProxy('http://x/x', {}, {});
    assert.equal(x.proxy, null);
  });

  it('local config should take priority', function() {
    let x = setupProxy('http://x/x', {http_proxy: '123'}, {http_proxy: '456'});
    assert.equal(x.proxy, '123');
  });

  it('no_proxy is invalid', function() {
    let x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: false}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: null}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: []}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('http://x/x', {http_proxy: '123', no_proxy: ''}, {});
    assert.equal(x.proxy, '123');
  });

  it('no_proxy - simple/include', function() {
    let x = setupProxy('http://localhost', {http_proxy: '123'}, {no_proxy: 'localhost'});
    assert.equal(x.proxy, undefined);
  });

  it('no_proxy - simple/not', function() {
    let x = setupProxy('http://localhost', {http_proxy: '123'}, {no_proxy: 'blah'});
    assert.equal(x.proxy, '123');
  });

  it('no_proxy - various, single string', function() {
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

  it('no_proxy - various, array', function() {
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

  it('no_proxy - hostport', function() {
    let x = setupProxy('http://localhost:80', {http_proxy: '123'}, {no_proxy: 'localhost'});
    assert.equal(x.proxy, null);
    x = setupProxy('http://localhost:8080', {http_proxy: '123'}, {no_proxy: 'localhost'});
    assert.equal(x.proxy, null);
  });

  it('no_proxy - secure', function() {
    let x = setupProxy('https://something', {http_proxy: '123'}, {});
    assert.equal(x.proxy, null);
    x = setupProxy('https://something', {https_proxy: '123'}, {});
    assert.equal(x.proxy, '123');
    x = setupProxy('https://something', {http_proxy: '456', https_proxy: '123'}, {});
    assert.equal(x.proxy, '123');
  });
});
