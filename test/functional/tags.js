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
        var f = readfile('fixtures/tags.json').toString().replace(/__NAME__/g, 'testexp_tags')
        res.send(JSON.parse(f))
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

  describe('dist-tags methods', function() {
    before(function () {
      express.get('/testexp_tags2', function(req, res) {
        var f = readfile('fixtures/tags.json').toString().replace(/__NAME__/g, 'testexp_tags2')
        res.send(JSON.parse(f))
      })
    })

    // populate cache
    before(function () {
      return server.get_package('testexp_tags2')
               .status(200)
    })

    beforeEach(function () {
      return server.request({
        method: 'PUT',
        uri:    '/-/package/testexp_tags2/dist-tags',
        json:   {
          foo: '0.1.0',
          bar: '0.1.1alpha',
          baz: '0.1.2',
        },
      }).status(201).body_ok(/tags updated/)
    })

    it('fetching tags', function () {
      return server.request({
        method: 'GET',
        uri:    '/-/package/testexp_tags2/dist-tags',
      }).status(200).then(function (body) {
        assert.deepEqual(body,
        { foo: '0.1.0',
          bar: '0.1.1alpha',
          baz: '0.1.2',
          latest: '0.1.3alpha' })
      })
    })

    it('merging tags', function () {
      return server.request({
        method: 'POST',
        uri:    '/-/package/testexp_tags2/dist-tags',
        json:   {
          foo: '0.1.2',
          quux: '0.1.0',
        },
      }).status(201).body_ok(/updated/).then(function () {
        return server.request({
          method: 'GET',
          uri:    '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function (body) {
          assert.deepEqual(body,
          { foo: '0.1.2',
            bar: '0.1.1alpha',
            baz: '0.1.2',
            quux: '0.1.0',
            latest: '0.1.3alpha' })
        })
      })
    })

    it('replacing tags', function () {
      return server.request({
        method: 'PUT',
        uri:    '/-/package/testexp_tags2/dist-tags',
        json:   {
          foo: '0.1.2',
          quux: '0.1.0',
        },
      }).status(201).body_ok(/updated/).then(function () {
        return server.request({
          method: 'GET',
          uri:    '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function (body) {
          assert.deepEqual(body,
          { foo: '0.1.2',
            quux: '0.1.0',
            latest: '0.1.3alpha' })
        })
      })
    })

    it('adding a tag', function () {
      return server.request({
        method: 'PUT',
        uri:    '/-/package/testexp_tags2/dist-tags/foo',
        json:   '0.1.3alpha',
      }).status(201).body_ok(/tagged/).then(function () {
        return server.request({
          method: 'GET',
          uri:    '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function (body) {
        assert.deepEqual(body,
          { foo: '0.1.3alpha',
            bar: '0.1.1alpha',
            baz: '0.1.2',
            latest: '0.1.3alpha' })
        })
      })
    })

    it('removing a tag', function () {
      return server.request({
        method: 'DELETE',
        uri:    '/-/package/testexp_tags2/dist-tags/foo',
      }).status(201).body_ok(/removed/).then(function () {
        return server.request({
          method: 'GET',
          uri:    '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function (body) {
        assert.deepEqual(body,
          { bar: '0.1.1alpha',
            baz: '0.1.2',
            latest: '0.1.3alpha' })
        })
      })
    })
  })
}
