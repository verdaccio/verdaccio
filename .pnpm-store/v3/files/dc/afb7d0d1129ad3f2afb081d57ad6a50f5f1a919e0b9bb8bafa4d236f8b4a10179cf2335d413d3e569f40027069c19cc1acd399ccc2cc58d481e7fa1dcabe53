'use strict';

var PassThrough = require('stream').PassThrough;
var Writable = require('stream').Writable;
var util = require('util');

util.inherits(Appendee, PassThrough);
util.inherits(Appender, Writable);

function Appendee(factory, opts) {
	PassThrough.call(this, opts);
	this.factory = factory;
	this.opts = opts;
}

//noinspection JSUnusedGlobalSymbols
Appendee.prototype._flush = function (end) {
	var stream = this.factory();
	stream.pipe(new Appender(this, this.opts))
		.on('finish', end);
	stream.resume();
};

function Appender(target, opts) {
	Writable.call(this, opts);
	this.target = target;
}

//noinspection JSUnusedGlobalSymbols
Appender.prototype._write = function (chunk, enc, cb) {
	this.target.push(chunk);
	cb();
};

function addStream(stream, opts) {
	opts = opts || {};
	var factory;
	if (typeof stream === 'function') {
		factory = stream;
	}
	else {
		stream.pause();
		factory = function () {
			return stream;
		};
	}
	return new Appendee(factory, opts);
}

addStream.obj = function (stream, opts) {
	opts = opts || {};
	opts.objectMode = true;
	return addStream(stream, opts);
};

module.exports = addStream;
