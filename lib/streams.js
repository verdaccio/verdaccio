var stream = require('stream');
var util = require('util');

//
// This stream is used to read tarballs from repository
//
function ReadTarball(options) {
	stream.PassThrough.call(this, options);
}

// called when data is not needed anymore
UploadTarball.prototype.abort = function() {
	this.emit('error', new Error('not implemented'));
};

util.inherits(ReadTarball, stream.PassThrough);
module.exports.ReadTarballStream = ReadTarball;

//
// This stream is used to upload tarballs to a repository
//
function UploadTarball(options) {
	stream.Writable.call(this, options);
}

// called when user closes connection before upload finishes
UploadTarball.prototype.abort = function() {
	this.emit('error', new Error('not implemented'));
};

// called when upload finishes successfully
UploadTarball.prototype.done = function() {
	this.emit('error', new Error('not implemented'));
};

util.inherits(UploadTarball, stream.Writable);
module.exports.UploadTarballStream = UploadTarball;

