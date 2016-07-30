var assert  = require('assert')
var request = require('./smart_request')
var Promise = require('bluebird')

function Server(url) {
  var self = Object.create(Server.prototype)
  self.url = url.replace(/\/$/, '')
  self.userAgent = 'node/v0.10.8 linux x64'
  self.authstr = 'Basic '+(new Buffer('test:test')).toString('base64')
  return self
}

Server.prototype.request = function(options) {
  assert(options.uri)
  var headers = options.headers || {}
  headers.accept = headers.accept || 'application/json'
  headers['user-agent'] = headers['user-agent'] || this.userAgent
  headers.authorization = headers.authorization || this.authstr

  return request({
    url: this.url + options.uri,
    method: options.method || 'GET',
    headers: headers,
    encoding: options.encoding,
    json: options.json != null ? options.json : true,
  })
}

Server.prototype.auth = function(user, pass) {
  this.authstr = 'Basic '+(Buffer(user+':'+pass)).toString('base64')
  return this.request({
    uri: '/-/user/org.couchdb.user:'+encodeURIComponent(user)+'/-rev/undefined',
    method: 'PUT',
    json: {
      name: user,
      password: pass,
      email: 'test@example.com',
      _id: 'org.couchdb.user:' + user,
      type: 'user',
      roles: [],
      date: new Date(),
    }
  })
}

Server.prototype.get_package = function(name) {
  return this.request({
    uri: '/'+encodeURIComponent(name),
    method: 'GET',
  })
}

Server.prototype.put_package = function(name, data) {
  if (typeof(data) === 'object' && !Buffer.isBuffer(data)) data = JSON.stringify(data)
  return this.request({
    uri: '/'+encodeURIComponent(name),
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
  }).send(data)
}

Server.prototype.put_version = function(name, version, data) {
  if (typeof(data) === 'object' && !Buffer.isBuffer(data)) data = JSON.stringify(data)
  return this.request({
    uri: '/'+encodeURIComponent(name)+'/'+encodeURIComponent(version)+'/-tag/latest',
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
  }).send(data)
}

Server.prototype.get_tarball = function(name, filename) {
  return this.request({
    uri: '/'+encodeURIComponent(name)+'/-/'+encodeURIComponent(filename),
    method: 'GET',
    encoding: null
  })
}

Server.prototype.put_tarball = function(name, filename, data) {
  return this.request({
    uri: '/'+encodeURIComponent(name)+'/-/'+encodeURIComponent(filename)+'/whatever',
    method: 'PUT',
    headers: {
      'content-type': 'application/octet-stream'
    },
  }).send(data)
}

Server.prototype.add_tag = function(name, tag, version) {
  return this.request({
    uri: '/'+encodeURIComponent(name)+'/'+encodeURIComponent(tag),
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
  }).send(JSON.stringify(version))
}

Server.prototype.put_tarball_incomplete = function(name, filename, data, size, cb) {
  var promise = this.request({
    uri: '/'+encodeURIComponent(name)+'/-/'+encodeURIComponent(filename)+'/whatever',
    method: 'PUT',
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': size,
    },
    timeout: 1000,
  })

  promise.request(function (req) {
    req.write(data)
    setTimeout(function() {
      req.req.abort()
    }, 20)
  })

  return new Promise(function (resolve, reject) {
    promise
      .then(function() {
        reject(Error('no error'))
      })
      .catch(function(err) {
        if (err.code === 'ECONNRESET') {
          resolve()
        } else {
          reject(err)
        }
      })
  })
}

Server.prototype.add_package = function(name) {
  return this.put_package(name, require('./package')(name))
           .status(201)
           .body_ok('created new package')
}

Server.prototype.whoami = function() {
  return this.request({ uri:'/-/whoami' })
           .status(200)
           .then(function(x) { return x.username })
}

Server.prototype.debug = function() {
  return this.request({
    uri: '/-/_debug',
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    },
  })
}

module.exports = Server

