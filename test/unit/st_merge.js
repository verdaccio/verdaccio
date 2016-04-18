var assert      = require('assert')
var semver_sort = require('../../lib/utils').semver_sort
var merge       = require('../../lib/storage')._merge_versions

require('../../lib/logger').setup([])

describe('Merge', function() {
  it('simple', function() {
    var x = {
      versions: {a:1,b:1,c:1},
      'dist-tags': {},
    }
    merge(x, {versions: {a:2,q:2}})
    assert.deepEqual(x, {
      versions: {a:1,b:1,c:1,q:2},
      'dist-tags': {},
    })
  })

  it('dist-tags - compat', function() {
    var x = {
      versions: {},
      'dist-tags': {q:'1.1.1',w:'2.2.2'},
    }
    merge(x, {'dist-tags':{q:'2.2.2',w:'3.3.3',t:'4.4.4'}})
    assert.deepEqual(x, {
      versions: {},
      'dist-tags': {q:'2.2.2',w:'3.3.3',t:'4.4.4'},
    })
  })

  it('semver_sort', function() {
    assert.deepEqual(semver_sort(['1.2.3','1.2','1.2.3a','1.2.3c','1.2.3-b']),
    [ '1.2.3a',
      '1.2.3-b',
      '1.2.3c',
      '1.2.3' ]
    )
  })
})

