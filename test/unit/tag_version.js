'use strict';

let assert = require('assert');
let tag_version = require('../../src/lib/utils').tag_version;

require('../../src/lib/logger').setup([]);

describe('tag_version', function() {
  it('add new one', function() {
    let x = {
      'versions': {},
      'dist-tags': {},
    };
    assert(tag_version(x, '1.1.1', 'foo', {}));
    assert.deepEqual(x, {
      'versions': {},
      'dist-tags': {foo: '1.1.1'},
    });
  });

  it('add (compat)', function() {
    let x = {
      'versions': {},
      'dist-tags': {foo: '1.1.0'},
    };
    assert(tag_version(x, '1.1.1', 'foo'));
    assert.deepEqual(x, {
      'versions': {},
      'dist-tags': {foo: '1.1.1'},
    });
  });

  it('add fresh tag', function() {
    let x = {
      'versions': {},
      'dist-tags': {foo: '1.1.0'},
    };
    assert(tag_version(x, '1.1.1', 'foo'));
    assert.deepEqual(x, {
      'versions': {},
      'dist-tags': {foo: '1.1.1'},
    });
  });
});

