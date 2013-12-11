var assert = require('assert')
  , ex = module.exports
  , server = process.server
  , readfile = require('fs').readFileSync
  , express = process.express

ex['testing for 404'] = function(cb) {
	server.get_package('testexp_tags', function(res, body) {
		// shouldn't exist yet
		assert.equal(res.statusCode, 404)
		assert(~body.error.indexOf('no such package'))
		cb()
	})
}

ex['setting up server with bad tags'] = function(cb) {
	express.get('/testexp_tags', function(req, res) {
		res.send(JSON.parse(readfile('fixtures/tags.json')))
	})
	cb()
}

ex['fetching package again'] = function(cb) {
	server.get_package('testexp_tags', function(res, body) {
		// shouldn't exist yet
		assert.equal(res.statusCode, 200)
		assert.equal(typeof(body.versions['1.1']), 'object')
		assert.equal(body['dist-tags'].something, '0.1.1alpha')
		assert.equal(body['dist-tags'].latest, '0.1.3alpha')
		assert.equal(body['dist-tags'].bad, null)
		cb()
	})
}

