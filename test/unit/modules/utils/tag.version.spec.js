let assert = require('assert');
let tag_version = require('../../../../src/lib/utils').tagVersion;

require('../../../../src/lib/logger').setup([]);

describe('tag_version', () => {
  test('add new one', () => {
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

  test('add (compat)', () => {
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

  test('add fresh tag', () => {
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

