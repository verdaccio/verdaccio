// ensure that all arguments are validated

var assert = require('assert')

describe('index.js app', function() {
  var source = require('fs').readFileSync(__dirname + '/../../lib/index.js', 'utf8')

  var very_scary_regexp = /\n\s*app\.(\w+)\s*\(\s*(("[^"]*")|('[^']*'))\s*,/g
  var m
  var params = {}

  while ((m = very_scary_regexp.exec(source)) != null) {
    if (m[1] === 'set') continue

    var inner = m[2].slice(1, m[2].length-1)
    var t

    inner.split('/').forEach(function(x) {
      if (m[1] === 'param') {
        params[x] = 'ok'
      } else if (t = x.match(/^:([^?:]*)\??$/)) {
        params[t[1]] = params[t[1]] || m[0].trim()
      }
    })
  }

  Object.keys(params).forEach(function(param) {
    it('should validate ":'+param+'"', function() {
      assert.equal(params[param], 'ok')
    })
  })
})

