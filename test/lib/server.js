var request = require('request');
var assert = require('assert');

function Server(url) {
	if (!(this instanceof Server)) return new Server(url);
	this.url = url.replace(/\/$/, '');
	this.userAgent = 'node/v0.10.8 linux x64';
}

Server.prototype.request = function(options, cb) {
	options.headers = options.headers || {};

	return request({
		url: this.url + options.uri,
		method: options.method || 'GET',
		headers: {
			accept: options.headers.accept || 'application/json',
			'user-agent': options.headers['user-agent'] || this.userAgent,
			authorization: this.auth,
		},
		json: options.json
	}, cb);
}

Server.prototype.auth = function(user, pass, cb) {
	this.auth = 'Basic '+(new Buffer(user+':'+pass)).toString('base64');
	this.request({
		uri: '/-/user/org.couchdb.user:'+escape(user)+'/-rev/undefined',
		method: 'PUT',
		json: {
			content: "doesn't matter, 'cause sinopia uses info from Authorization header anywayz",
		}
	}, function(req, res, body) {
		assert.notEqual(body.ok.indexOf('"'+user+'"'), -1);
		cb();
	});
}

Server.prototype.get_package = function(name, cb) {
	request({
		uri: '/'+name,
		method: 'GET',
	}, function(req, res, body) {
		cb(body);
	});
}

Server.prototype.put_package = function(name, data, cb) {
	request({
		uri: '/'+name,
		method: 'PUT',
		json: data,
	}, function(req, res, body) {
		cb(body);
	});
}

module.exports = Server;

