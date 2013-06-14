var request = require('request');
var UError = require('./error').UserError;
var URL = require('url');

function Storage(name, config) {
	if (!(this instanceof Storage)) return new Storage(config);
	this.config = config;
	this.name = name;
	this.ca;

	if (URL.parse(this.config.uplinks[this.name].url).hostname === 'registry.npmjs.org') {
		this.ca = require('./npmsslkeys');
	}
	return this;
}

Storage.prototype.get_package = function(name, callback) {
	request({
		url: this.config.uplinks[this.name].url + '/' + name,
		json: true,
		headers: {
			'User-Agent': this.config.user_agent,
		},
		ca: this.ca,
	}, function(err, res, body) {
		if (err) return callback(err);
		if (res.statusCode === 404) {
			return callback(new UError({
				msg: 'package doesn\'t exist on uplink',
				status: 404,
			}));
		}
		if (!(res.statusCode >= 200 && res.statusCode < 300)) {
			return callback(new Error('bad status code: ' + res.statusCode));
		}
		callback(null, body);
	});
}

module.exports = Storage;

