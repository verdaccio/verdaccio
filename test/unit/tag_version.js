var assert      = require('assert')
var tag_version = require('../../lib/utils').tag_version

require('../../lib/logger').setup([])

describe('tag_version', function() {
  it('add new one', function() {
    var x = {
      versions: {},
      'dist-tags': {},
    }
    assert(tag_version(x, '1.1.1', 'foo', {}))
    assert.deepEqual(x, {
      versions: {},
      'dist-tags': {foo: '1.1.1'},
    })
  })

  it('add (compat)', function() {
    var x = {
      versions: {},
      'dist-tags': {foo: '1.1.0'},
    }
    assert(tag_version(x, '1.1.1', 'foo'))
    assert.deepEqual(x, {
      versions: {},
      'dist-tags': {foo: '1.1.1'},
    })
  })

  it('add fresh tag', function() {
    var x = {
      versions: {},
      'dist-tags': {foo: '1.1.0'},
    }
    assert(tag_version(x, '1.1.1', 'foo'))
    assert.deepEqual(x, {
      versions: {},
      'dist-tags': {foo: '1.1.1'},
    })
  })

})

