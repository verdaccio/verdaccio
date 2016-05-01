
var assert = require('assert')
var request = require('request')
var Promise = require('bluebird')
var Symbol = require('symbol')
var sym = Symbol('smart_request_data')

function smart_request(options) {
  var self = {}
  self[sym] = {}
  self[sym].error = Error()
  Error.captureStackTrace(self[sym].error, smart_request)

  var result = new Promise(function (resolve, reject) {
    self[sym].request = request(options, function (err, res, body) {
      if (err) return reject(err)
      self[sym].response = res
      resolve(body)
    })
  })

  return extend(self, result)
}

function extend(self, promise) {
  promise[sym] = self[sym]
  Object.setPrototypeOf(promise, extensions)
  return promise
}

var extensions = Object.create(Promise.prototype)

extensions.status = function (expected) {
  var self_data = this[sym]

  return extend(this, this.then(function (body) {
    try {
      assert.equal(self_data.response.statusCode, expected)
    } catch(err) {
      self_data.error.message = err.message
      throw self_data.error
    }
    return body
  }))
}

extensions.body_ok = function (expected) {
  var self_data = this[sym]

  return extend(this, this.then(function (body) {
    try {
      if (Object.prototype.toString.call(expected) === '[object RegExp]') {
        assert(body.ok.match(expected), "'" + body.ok + "' doesn't match " + expected)
      } else {
        assert.equal(body.ok, expected)
      }
      assert.equal(body.error, null)
    } catch(err) {
      self_data.error.message = err.message
      throw self_data.error
    }
    return body
  }))
}

extensions.body_error = function (expected) {
  var self_data = this[sym]

  return extend(this, this.then(function (body) {
    try {
      if (Object.prototype.toString.call(expected) === '[object RegExp]') {
        assert(body.error.match(expected), body.error + " doesn't match " + expected)
      } else {
        assert.equal(body.error, expected)
      }
      assert.equal(body.ok, null)
    } catch(err) {
      self_data.error.message = err.message
      throw self_data.error
    }
    return body
  }))
}

extensions.request = function (cb) {
  cb(this[sym].request)
  return this
}

extensions.response = function (cb) {
  var self_data = this[sym]

  return extend(this, this.then(function (body) {
    cb(self_data.response)
    return body
  }))
}

extensions.send = function (data) {
  this[sym].request.end(data)
  return this
}

module.exports = smart_request

