var assert = require('assert')

function readfile(x) {
  return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
  var server = process.server
  var express = process.express

  it('tags - testing for 404', function () {
    return server.get_package('testexp_tags')
             // shouldn't exist yet
             .status(404)
             .body_error(/no such package/)
  })

  describe('tags', function() {
    before(function () {
      express.get('/testexp_tags', function(req, res) {
        res.send(JSON.parse(readfile('fixtures/tags.json')))
      })
    })

    it('fetching package again', function () {
      return server.get_package('testexp_tags')
               .status(200)
               .then(function (body) {
                 assert.equal(typeof(body.versions['1.1']), 'object')
                 assert.equal(body['dist-tags'].something, '0.1.1alpha')
                 // note: 5.4.3 is invalid tag, 0.1.3alpha is highest semver
                 assert.equal(body['dist-tags'].latest, '0.1.3alpha')
                 assert.equal(body['dist-tags'].bad, null)
               })
    })

    ;['0.1.1alpha', '0.1.1-alpha', '0000.00001.001-alpha'].forEach(function(ver) {
      it('fetching '+ver, function () {
        return server.request({uri:'/testexp_tags/'+ver})
                 .status(200)
                 .then(function (body) {
                   assert.equal(body.version, '0.1.1alpha')
                 })
      })
    })
  })
}
