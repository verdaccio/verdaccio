var assert = require('assert')
  , ex = module.exports

function readfile(x) {
	return require('fs').readFileSync(__dirname + '/' + x)
}

module.exports = function() {
	var server = process.server
	var express = process.express

	it('tags - testing for 404', function(cb) {
		server.get_package('testexp_tags', function(res, body) {
			// shouldn't exist yet
			assert.equal(res.statusCode, 404)
			assert.equal(body.error, 'not_found')
			assert(~body.reason.indexOf('no such package'))
			cb()
		})
	})

	describe('tags', function() {
		before(function(cb) {
			express.get('/testexp_tags', function(req, res) {
				res.send(JSON.parse(readfile('fixtures/tags.json')))
			})
			cb()
		})

		it('fetching package again', function(cb) {
			server.get_package('testexp_tags', function(res, body) {
				assert.equal(res.statusCode, 200)
				assert.equal(typeof(body.versions['1.1']), 'object')
				assert.equal(body['dist-tags'].something, '0.1.1alpha')
				assert.equal(body['dist-tags'].latest, '0.1.3alpha')
				assert.equal(body['dist-tags'].bad, null)
				cb()
			})
		})

		;['0.1.1alpha', '0.1.1-alpha', '0000.00001.001-alpha'].forEach(function(ver) {
			it('fetching '+ver, function(cb) {
				server.request({uri:'/testexp_tags/'+ver}, function(err, res, body) {
					assert.equal(res.statusCode, 200)
					assert.equal(body.version, '0.1.1alpha')
					cb()
				})
			})
		})
	})
}
