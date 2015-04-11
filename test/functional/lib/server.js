var assert  = require('assert')
var request = require('request')

function Server(url) {
  var self = Object.create(Server.prototype)
  self.url = url.replace(/\/$/, '')
  self.userAgent = 'node/v0.10.8 linux x64'
  self.authstr = 'Basic '+(new Buffer('test:test')).toString('base64')
  return self
}

function prep(cb) {
  return function(err, res, body) {
    if (err) throw err
    cb(res, body)
  }
}

Server.prototype.request = function(options, cb) {
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
  }, cb)
}

Server.prototype.auth = function(user, pass, cb) {
  this.authstr = 'Basic '+(Buffer(user+':'+pass)).toString('base64')
  this.request({
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
  }, prep(cb))
}

Server.prototype.get_package = function(name, cb) {
  this.request({
    uri: '/'+encodeURIComponent(name),
    method: 'GET',
  }, prep(cb))
}

Server.prototype.put_package = function(name, data, cb) {
  if (typeof(data) === 'object' && !Buffer.isBuffer(data)) data = JSON.stringify(data)
  this.request({
    uri: '/'+encodeURIComponent(name),
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
  }, prep(cb)).end(data)
}

Server.prototype.put_version = function(name, version, data, cb) {
  if (typeof(data) === 'object' && !Buffer.isBuffer(data)) data = JSON.stringify(data)
  this.request({
    uri: '/'+encodeURIComponent(name)+'/'+encodeURIComponent(version)+'/-tag/latest',
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
  }, prep(cb)).end(data)
}

Server.prototype.get_tarball = function(name, filename, cb) {
  this.request({
    uri: '/'+encodeURIComponent(name)+'/-/'+encodeURIComponent(filename),
    method: 'GET',
  }, prep(cb))
}

Server.prototype.put_tarball = function(name, filename, data, cb) {
  this.request({
    uri: '/'+encodeURIComponent(name)+'/-/'+encodeURIComponent(filename)+'/whatever',
    method: 'PUT',
    headers: {
      'content-type': 'application/octet-stream'
    },
  }, prep(cb)).end(data)
}

Server.prototype.add_tag = function(name, tag, version, cb) {
  this.request({
    uri: '/'+encodeURIComponent(name)+'/'+encodeURIComponent(tag),
    method: 'PUT',
    headers: {
      'content-type': 'application/json'
    },
  }, prep(cb)).end(JSON.stringify(version))
}

Server.prototype.put_tarball_incomplete = function(name, filename, data, size, cb) {
  var req = this.request({
    uri: '/'+encodeURIComponent(name)+'/-/'+encodeURIComponent(filename)+'/whatever',
    method: 'PUT',
    headers: {
      'content-type': 'application/octet-stream',
      'content-length': size,
    },
    timeout: 1000,
  }, function(err) {
    assert(err)
    cb()
  })
  req.write(data)
  setTimeout(function() {
    req.req.abort()
  }, 20)
}

Server.prototype.add_package = function(name, cb) {
  this.put_package(name, require('./package')(name), function(res, body) {
    assert.equal(res.statusCode, 201)
    assert(~body.ok.indexOf('created new package'))
    cb()
  })
}

Server.prototype.whoami = function(cb) {
  this.request({ uri:'/-/whoami' }, function(err, res, body) {
    assert.equal(err, null)
    assert.equal(res.statusCode, 200)
    cb(body.username)
  })
}

Server.prototype.debug = function(cb) {
  this.request({
    uri: '/-/_debug',
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    },
  }, prep(cb))
}

module.exports = Server

