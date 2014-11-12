var Stream = require('stream')
var Util   = require('util')

module.exports.ReadTarballStream = ReadTarball
module.exports.UploadTarballStream = UploadTarball

//
// This stream is used to read tarballs from repository
//
function ReadTarball(options) {
  var self = new Stream.PassThrough(options)
  Object.setPrototypeOf(self, ReadTarball.prototype)

  // called when data is not needed anymore
  add_abstract_method(self, 'abort')

  return self
}

Util.inherits(ReadTarball, Stream.PassThrough)

//
// This stream is used to upload tarballs to a repository
//
function UploadTarball(options) {
  var self = new Stream.PassThrough(options)
  Object.setPrototypeOf(self, UploadTarball.prototype)

  // called when user closes connection before upload finishes
  add_abstract_method(self, 'abort')

  // called when upload finishes successfully
  add_abstract_method(self, 'done')

  return self
}

Util.inherits(UploadTarball, Stream.PassThrough)

//
// This function intercepts abstract calls and replays them allowing
// us to attach those functions after we are ready to do so
//
function add_abstract_method(self, name) {
  self._called_methods = self._called_methods || {}
  self.__defineGetter__(name, function() {
    return function() {
      self._called_methods[name] = true
    }
  })
  self.__defineSetter__(name, function(fn) {
    delete self[name]
    self[name] = fn
    if (self._called_methods && self._called_methods[name]) {
      delete self._called_methods[name]
      self[name]()
    }
  })
}

