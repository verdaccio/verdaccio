var request = require('request');
var assert = require('assert');

function Server(url) {
	if (!(this instanceof Server)) return new Server(url);
	this.url = url.replace(/\/$/, '');
	this.userAgent = 'node/v0.10.8 linux x64';
	this.authstr = 'Basic '+(new Buffer('test:test')).toString('base64');
}

function prep(cb) {
	return function(err, res, body) {
		if (err) throw err;
		cb(res, body);
	};
}

Server.prototype.request = function(options, cb) {
	var headers = options.headers || {};
	headers.accept = headers.accept || 'application/json';
	headers['user-agent'] = headers['user-agent'] || this.userAgent;
	headers.authorization = headers.authorization || this.authstr;
	return request({
		url: this.url + options.uri,
		method: options.method || 'GET',
		headers: headers,
		json: options.json || true,
	}, cb);
}

Server.prototype.auth = function(user, pass, cb) {
	this.authstr = 'Basic '+(new Buffer(user+':'+pass)).toString('base64');
	this.request({
		uri: '/-/user/org.couchdb.user:'+escape(user)+'/-rev/undefined',
		method: 'PUT',
		json: {
			content: "doesn't matter, 'cause sinopia uses info from Authorization header anywayz",
		}
	}, prep(cb));
}

Server.prototype.get_package = function(name, cb) {
	this.request({
		uri: '/'+name,
		method: 'GET',
	}, prep(cb));
}

Server.prototype.put_package = function(name, data, cb) {
	if (typeof(data) === 'object' && !Buffer.isBuffer(data)) data = JSON.stringify(data);
	this.request({
		uri: '/'+escape(name),
		method: 'PUT',
		headers: {
			'content-type': 'application/json'
		},
	}, prep(cb)).end(data);
}

Server.prototype.put_version = function(name, version, data, cb) {
	if (typeof(data) === 'object' && !Buffer.isBuffer(data)) data = JSON.stringify(data);
	this.request({
		uri: '/'+escape(name)+'/'+escape(version)+'/-tag/latest',
		method: 'PUT',
		headers: {
			'content-type': 'application/json'
		},
	}, prep(cb)).end(data);
}

Server.prototype.get_tarball = function(name, filename, cb) {
	this.request({
		uri: '/'+escape(name)+'/-/'+escape(filename),
		method: 'GET',
	}, prep(cb));
}

Server.prototype.put_tarball = function(name, filename, data, cb) {
	this.request({
		uri: '/'+escape(name)+'/-/'+escape(filename)+'/whatever',
		method: 'PUT',
		headers: {
			'content-type': 'application/octet-stream'
		},
	}, prep(cb)).end(data);
}

Server.prototype.put_tarball_incomplete = function(name, filename, data, size, cb) {
	var req = this.request({
		uri: '/'+escape(name)+'/-/'+escape(filename)+'/whatever',
		method: 'PUT',
		headers: {
			'content-type': 'application/octet-stream',
			'content-length': size,
		},
		timeout: 1000,
	}, function(err) {
		assert(err);
		cb();
	});
	req.write(data);
	setTimeout(function() {
		req.req.abort();
	}, 20);
}

module.exports = Server;

