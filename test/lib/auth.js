
var request = require('request');
var assert = require('assert');

module.exports.auth = function(user, pass, cb) {
	request({
		url: 'http://localhost:55550/-/user/org.couchdb.user:'+escape(user)+'/-rev/undefined',
		method: 'PUT',
		headers: {
			accept: 'application/json',
			'user-agent': 'node/v0.10.8 linux x64',
			authorization: 'Basic '+(new Buffer(user+':'+pass)).toString('base64'),
		},
		json: {
			content: "doesn't matter, 'cause sinopia uses info from Authorization header anywayz",
		}
	}, function(req, res, body) {
		assert.notEqual(body.ok.indexOf('"'+user+'"'), -1);
		cb();
	});
}

