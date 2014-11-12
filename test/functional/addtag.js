var assert = require('assert')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
  var server = process.server

  it('add tag - 404', function(cb) {
    server.add_tag('testpkg-tag', 'tagtagtag', '0.0.1', function(res, body) {
      assert.equal(res.statusCode, 404)
      assert(~body.error.indexOf('no such package'))
      cb()
    })
  })

  describe('addtag', function() {
    before(function(cb) {
      server.put_package('testpkg-tag', eval(
        '(' + readfile('fixtures/publish.json5')
          .toString('utf8')
          .replace(/__NAME__/g, 'testpkg-tag')
          .replace(/__VERSION__/g, '0.0.1')
        + ')'
      ), function(res, body) {
        assert.equal(res.statusCode, 201)
        cb()
      })
    })

    it('add testpkg-tag', function(){})

    it('add tag - bad ver', function(cb) {
      server.add_tag('testpkg-tag', 'tagtagtag', '0.0.1-x', function(res, body) {
        assert.equal(res.statusCode, 404)
        assert(~body.error.indexOf('version doesn\'t exist'))
        cb()
      })
    })

    it('add tag - bad tag', function(cb) {
      server.add_tag('testpkg-tag', 'tag/tag/tag', '0.0.1-x', function(res, body) {
        assert.equal(res.statusCode, 403)
        assert(~body.error.indexOf('invalid tag'))
        cb()
      })
    })

    it('add tag - good', function(cb) {
      server.add_tag('testpkg-tag', 'tagtagtag', '0.0.1', function(res, body) {
        assert.equal(res.statusCode, 201)
        assert(~body.ok.indexOf('tagged'))
        cb()
      })
    })
  })
}
