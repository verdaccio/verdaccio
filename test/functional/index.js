require('./lib/startup')

var assert = require('assert')
  , async = require('async')
  , crypto = require('crypto')
  , ex = module.exports

function readfile(x) {
	return require('fs').readFileSync(__dirname + '/' + x)
}

describe('Func', function() {
	var server = process.server
	var server2 = process.server2

	before(function(cb) {
		async.parallel([
			function(cb) {
				require('./lib/startup').start('./test-storage', './config-1.yaml', cb)
			},
			function(cb) {
				require('./lib/startup').start('./test-storage2', './config-2.yaml', cb)
			},
		], cb)
	})

	before(function auth(cb) {
		async.map([server, server2], function(server, cb) {
			server.auth('test', 'test', function(res, body) {
				assert.equal(res.statusCode, 201)
				assert.notEqual(body.ok.indexOf('"test"'), -1)
				cb()
			})
		}, cb)
	})

	it('authenticate', function(){/* test for before() */})

	require('./basic')()
	require('./gh29')()
	require('./tags')()
	require('./mirror')()
	require('./race')()
	require('./racycrash')()
	require('./security')()
	require('./addtag')()
})

