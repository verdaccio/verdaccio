var stream = require('stream');
var util = require('util');

//
// This stream is used to read tarballs from repository
//
function ReadTarball(options) {
	stream.PassThrough.call(this, options);

	// called when data is not needed anymore
	add_abstract_method(this, 'abort');
}

util.inherits(ReadTarball, stream.PassThrough);
module.exports.ReadTarballStream = ReadTarball;

//
// This stream is used to upload tarballs to a repository
//
function UploadTarball(options) {
	stream.PassThrough.call(this, options);
	
	// called when user closes connection before upload finishes
	add_abstract_method(this, 'abort');
	
	// called when upload finishes successfully
	add_abstract_method(this, 'done');
}

util.inherits(UploadTarball, stream.PassThrough);
module.exports.UploadTarballStream = UploadTarball;

//
// This function intercepts abstract calls and replays them allowing
// us to attach those functions after we are ready to do so
//
function add_abstract_method(self, name) {
	self._called_methods = self._called_methods || {};
	self.__defineGetter__(name, function() {
		return function() {
			self._called_methods[name] = true;
		}
	});
	self.__defineSetter__(name, function(fn) {
		delete self[name];
		self[name] = fn;
		if (self._called_methods && self._called_methods[name]) {
			delete self._called_methods[name];
			self[name]();
		}
	});
}

function __test() {
	var test = new ReadTarball();
	test.abort();
	setTimeout(function() {
		test.abort = function() {
			console.log('ok');
		};
		test.abort = function() {
			throw 'fail';
		};
	}, 100);
}

