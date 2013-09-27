var request = require('request');
var assert = require('assert');

function Server(url) {
	if (!(this instanceof Server)) return new Server(url);
	this.url = url.replace(/\/$/, '');
	this.userAgent = 'node/v0.10.8 linux x64';
}

function prep(cb) {
	return function(err, res, body) {
		if (err) throw err;
		cb(res, body);
	};
}

Server.prototype.request = function(options, cb) {
	options.headers = options.headers || {};
	return request({
		url: this.url + options.uri,
		method: options.method || 'GET',
		headers: {
			accept: options.headers.accept || 'application/json',
			'user-agent': options.headers['user-agent'] || this.userAgent,
			'content-type': options.headers['content-type'],
			authorization: this.auth,
		},
		json: options.json || true,
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
		uri: '/'+name,
		method: 'PUT',
		headers: {
			'content-type': 'application/json'
		},
	}, prep(cb)).end(data);
}

Server.prototype.get_tarball = function(name, filename, cb) {
	this.request({
		uri: '/'+name+'/-/'+filename,
		method: 'GET',
	}, prep(cb));
}

Server.prototype.put_tarball = function(name, filename, data, cb) {
	this.request({
		uri: '/'+name+'/-/'+filename+'/whatever',
		method: 'PUT',
		headers: {
			'content-type': 'application/octet-stream'
		},
	}, prep(cb)).end(data);
}

module.exports = Server;

