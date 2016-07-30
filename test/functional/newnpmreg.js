var assert = require('assert')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

function sha(x) {
  return require('crypto').createHash('sha1', 'binary').update(x).digest('hex')
}

module.exports = function() {
  var server = process.server
  var server2 = process.server2
  var express = process.express

  describe('newnpmreg', function() {
    before(function () {
      return server.request({
        uri: '/testpkg-newnpmreg',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
        json: JSON.parse(readfile('fixtures/newnpmreg.json')),
      }).status(201)
    })

    it('add pkg', function () {})

    it('server1 - tarball', function () {
      return server.get_tarball('testpkg-newnpmreg', 'testpkg-newnpmreg-0.0.0.tgz')
               .status(200)
               .then(function (body) {
                 // not real sha due to utf8 conversion
                 assert.strictEqual(sha(body), '8ee7331cbc641581b1a8cecd9d38d744a8feb863')
               })
    })

    it('server2 - tarball', function () {
      return server2.get_tarball('testpkg-newnpmreg', 'testpkg-newnpmreg-0.0.0.tgz')
               .status(200)
               .then(function (body) {
                 // not real sha due to utf8 conversion
                 assert.strictEqual(sha(body), '8ee7331cbc641581b1a8cecd9d38d744a8feb863')
               })
    })

    it('server1 - package', function () {
      return server.get_package('testpkg-newnpmreg')
               .status(200)
               .then(function (body) {
                 assert.equal(body.name, 'testpkg-newnpmreg')
                 assert.equal(body.versions['0.0.0'].name, 'testpkg-newnpmreg')
                 assert.equal(body.versions['0.0.0'].dist.tarball, 'http://localhost:55551/testpkg-newnpmreg/-/testpkg-newnpmreg-0.0.0.tgz')
                 assert.deepEqual(body['dist-tags'], {foo: '0.0.0', latest: '0.0.0'})
               })
    })

    it('server2 - package', function () {
      return server2.get_package('testpkg-newnpmreg')
               .status(200)
               .then(function (body) {
                 assert.equal(body.name, 'testpkg-newnpmreg')
                 assert.equal(body.versions['0.0.0'].name, 'testpkg-newnpmreg')
                 assert.equal(body.versions['0.0.0'].dist.tarball, 'http://localhost:55552/testpkg-newnpmreg/-/testpkg-newnpmreg-0.0.0.tgz')
                 assert.deepEqual(body['dist-tags'], {foo: '0.0.0', latest: '0.0.0'})
               })
    })

    it('server1 - readme', function () {
      return server.request({ uri: '/-/readme/testpkg-newnpmreg' })
               .status(200)
               .then(function (body) {
                 assert.equal(body, '<p>blah blah blah</p>\n')
               })
    })

    it('server2 - readme', function () {
      return server2.request({ uri: '/-/readme/testpkg-newnpmreg' })
               .status(200)
               .then(function (body) {
                 assert.equal(body, '<p>blah blah blah</p>\n')
               })
    })

    describe('search', function() {
      function check(obj) {
        obj['testpkg-newnpmreg'].time.modified = '2014-10-02T07:07:51.000Z'
        assert.deepEqual(obj['testpkg-newnpmreg'],
          { name: 'testpkg-newnpmreg',
            description: '',
            author: '',
            license: 'ISC',
            'dist-tags': { latest: '0.0.0' },
            maintainers: [ { name: 'alex', email: 'alex@kocharin.ru' } ],
            readmeFilename: '',
            time: { modified: '2014-10-02T07:07:51.000Z' },
            versions: {},
            repository: { type: 'git', url: '' } })
      }

      before(function () {
        express.get('/-/all', function(req, res) {
          res.send({})
        })
      })

      it('server1 - search', function () {
        return server.request({ uri: '/-/all' })
                 .status(200)
                 .then(check)
      })

      it('server2 - search', function () {
        return server2.request({ uri: '/-/all' })
                 .status(200)
                 .then(check)
      })
    })
  })
}
