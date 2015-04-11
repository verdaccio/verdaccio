
function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function () {
  var server = process.server

  it('add tag - 404', function () {
    return server.add_tag('testpkg-tag', 'tagtagtag', '0.0.1')
             .status(404)
             .body_error(/no such package/)
  })

  describe('addtag', function() {
    before(function () {
      return server.put_package('testpkg-tag', eval(
               '(' + readfile('fixtures/publish.json5')
                 .toString('utf8')
                 .replace(/__NAME__/g, 'testpkg-tag')
                 .replace(/__VERSION__/g, '0.0.1')
               + ')'
             )).status(201)
    })

    it('add testpkg-tag', function(){})

    it('add tag - bad ver', function () {
      return server.add_tag('testpkg-tag', 'tagtagtag', '0.0.1-x')
               .status(404)
               .body_error(/version doesn't exist/)
    })

    it('add tag - bad tag', function () {
      return server.add_tag('testpkg-tag', 'tag/tag/tag', '0.0.1-x')
               .status(403)
               .body_error(/invalid tag/)
    })

    it('add tag - good', function () {
      return server.add_tag('testpkg-tag', 'tagtagtag', '0.0.1')
               .status(201)
               .body_ok(/tagged/)
    })
  })
}
