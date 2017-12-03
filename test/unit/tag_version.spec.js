'use strict';

let assert = require('assert');
let tag_version = require('../../src/lib/utils').tag_version;

require('../../src/lib/logger')({level: 'silent'});

describe('tag_version', function() {
  it('add new one', function() {
    let pkg = {
      'versions': {},
      'dist-tags': {},
    };
    assert(tag_version(pkg, '1.1.1', 'foo', {}));
    assert.deepEqual(pkg, {
      'versions': {},
      'dist-tags': {foo: '1.1.1'},
    });
  });

  it('add (compat)', function() {
    const x = {
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

