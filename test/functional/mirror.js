var assert = require('assert')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
  var server = process.server
  var server2 = process.server2

  it('testing anti-loop', function () {
    return server2.get_package('testloop')
             .status(404)
             .body_error(/no such package/)
  })

  ;['fwd', /*'loop'*/].forEach(function(pkg) {
    var prefix = pkg + ': '
    pkg = 'test' + pkg

    describe(pkg, function() {
      before(function () {
        return server.put_package(pkg, require('./lib/package')(pkg))
                 .status(201)
                 .body_ok(/created new package/)
      })

      it(prefix+'creating new package', function(){})

      describe(pkg, function() {
        before(function () {
          return server.put_version(pkg, '0.1.1', require('./lib/package')(pkg))
                   .status(201)
                   .body_ok(/published/)
        })

        it(prefix+'uploading new package version', function(){})

        it(prefix+'uploading incomplete tarball', function () {
          return server.put_tarball_incomplete(pkg, pkg+'.bad', readfile('fixtures/binary'), 3000)
        })

        describe('tarball', function() {
          before(function () {
            return server.put_tarball(pkg, pkg+'.file', readfile('fixtures/binary'))
                     .status(201)
                     .body_ok(/.*/)
          })

          it(prefix+'uploading new tarball', function(){})

          it(prefix+'downloading tarball from server1', function () {
            return server.get_tarball(pkg, pkg+'.file')
                     .status(200)
                     .then(function (body) {
                       assert.deepEqual(body, readfile('fixtures/binary'))
                     })
          })
        })
      })
    })
  })
}

