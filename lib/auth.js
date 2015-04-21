var Crypto       = require('crypto')
var jju          = require('jju')
var Error        = require('http-errors')
var Logger       = require('./logger')
var load_plugins = require('./plugin-loader').load_plugins

module.exports = Auth

function Auth(config) {
  var self = Object.create(Auth.prototype)
  self.config = config
  self.logger = Logger.logger.child({ sub: 'auth' })
  self.secret = config.secret

  var plugin_params = {
    config: config,
    logger: self.logger
  }

  if (config.users_file) {
    if (!config.auth || !config.auth.htpasswd) {
      // b/w compat
      config.auth = config.auth || {}
      config.auth.htpasswd = { file: config.users_file }
    }
  }

  self.plugins = load_plugins(config, config.auth, plugin_params, function (p) {
    return p.authenticate || p.allow_access || p.allow_publish
  })

  self.plugins.unshift({
    sinopia_version: '1.1.0',

    authenticate: function(user, password, cb) {
      if (config.users != null
       && config.users[user] != null
       && (Crypto.createHash('sha1').update(password).digest('hex')
            === config.users[user].password)
      ) {
        return cb(null, [ user ])
      }

      return cb()
    },

    adduser: function(user, password, cb) {
      if (config.users && config.users[user])
        return cb( Error[403]('this user already exists') )

      return cb()
    },
  })

  function allow_action(action) {
    return function(user, package, cb) {
      var ok = package[action].reduce(function(prev, curr) {
        if (user.groups.indexOf(curr) !== -1) return true
        return prev
      }, false)

      if (ok) return cb(null, true)

      if (user.name) {
        cb( Error[403]('user ' + user.name + ' is not allowed to ' + action + ' package ' + package.name) )
      } else {
        cb( Error[403]('unregistered users are not allowed to ' + action + ' package ' + package.name) )
      }
    }
  }

  self.plugins.push({
    authenticate: function(user, password, cb) {
      return cb( Error[403]('bad username/password, access denied') )
    },

    add_user: function(user, password, cb) {
      return cb( Error[409]('registration is disabled') )
    },

    allow_access: allow_action('access'),
    allow_publish: allow_action('publish'),
  })

  return self
}

Auth.prototype.authenticate = function(user, password, cb) {
  var plugins = this.plugins.slice(0)

  ;(function next() {
    var p = plugins.shift()

    if (typeof(p.authenticate) !== 'function') {
      return next()
    }

    p.authenticate(user, password, function(err, groups) {
      if (err) return cb(err)
      if (groups != null && groups != false)
        return cb(err, AuthenticatedUser(user, groups))
      next()
    })
  })()
}

Auth.prototype.add_user = function(user, password, cb) {
  var self = this
  var plugins = this.plugins.slice(0)

  ;(function next() {
    var p = plugins.shift()
    var n = 'adduser'
    if (typeof(p[n]) !== 'function') {
      n = 'add_user'
    }
    if (typeof(p[n]) !== 'function') {
      next()
    } else {
      p[n](user, password, function(err, ok) {
        if (err) return cb(err)
        if (ok) return self.authenticate(user, password, cb)
        next()
      })
    }
  })()
}

Auth.prototype.allow_access = function(package_name, user, callback) {
  var plugins = this.plugins.slice(0)
  var package = Object.assign({ name: package_name },
                              this.config.get_package_spec(package_name))

  ;(function next() {
    var p = plugins.shift()

    if (typeof(p.allow_access) !== 'function') {
      return next()
    }

    p.allow_access(user, package, function(err, ok) {
      if (err) return callback(err)
      if (ok) return callback(null, ok)
      next() // cb(null, false) causes next plugin to roll
    })
  })()
}

Auth.prototype.allow_publish = function(package_name, user, callback) {
  var plugins = this.plugins.slice(0)
  var package = Object.assign({ name: package_name },
                              this.config.get_package_spec(package_name))

  ;(function next() {
    var p = plugins.shift()

    if (typeof(p.allow_publish) !== 'function') {
      return next()
    }

    p.allow_publish(user, package, function(err, ok) {
      if (err) return callback(err)
      if (ok) return callback(null, ok)
      next() // cb(null, false) causes next plugin to roll
    })
  })()
}

Auth.prototype.basic_middleware = function() {
  var self = this
  return function(req, res, _next) {
    req.pause()
    function next(err) {
      req.resume()
      // uncomment this to reject users with bad auth headers
      //return _next.apply(null, arguments)

      // swallow error, user remains unauthorized
      // set remoteUserError to indicate that user was attempting authentication
      if (err) req.remote_user.error = err.message
      return _next()
    }

    if (req.remote_user != null && req.remote_user.name !== undefined)
      return next()
    req.remote_user = AnonymousUser()

    var authorization = req.headers.authorization
    if (authorization == null) return next()

    var parts = authorization.split(' ')

    if (parts.length !== 2)
      return next( Error[400]('bad authorization header') )

    var scheme = parts[0]
    if (scheme === 'Basic') {
      var credentials = Buffer(parts[1], 'base64').toString()
    } else if (scheme === 'Bearer') {
      var credentials = self.aes_decrypt(Buffer(parts[1], 'base64')).toString('utf8')
      if (!credentials) return next()
    } else {
      return next()
    }

    var index = credentials.indexOf(':')
    if (index < 0) return next()

    var user = credentials.slice(0, index)
    var pass = credentials.slice(index + 1)

    self.authenticate(user, pass, function(err, user) {
      if (!err) {
        req.remote_user = user
        next()
      } else {
        req.remote_user = AnonymousUser()
        next(err)
      }
    })
  }
}

Auth.prototype.bearer_middleware = function() {
  var self = this
  return function(req, res, _next) {
    req.pause()
    function next(_err) {
      req.resume()
      return _next.apply(null, arguments)
    }

    if (req.remote_user != null && req.remote_user.name !== undefined)
      return next()
    req.remote_user = AnonymousUser()

    var authorization = req.headers.authorization
    if (authorization == null) return next()

    var parts = authorization.split(' ')

    if (parts.length !== 2)
      return next( Error[400]('bad authorization header') )

    var scheme = parts[0]
    var token = parts[1]

    if (scheme !== 'Bearer')
      return next()

    try {
      var user = self.decode_token(token)
    } catch(err) {
      return next(err)
    }

    req.remote_user = AuthenticatedUser(user.u, user.g)
    req.remote_user.token = token
    next()
  }
}

Auth.prototype.cookie_middleware = function() {
  var self = this
  return function(req, res, _next) {
    req.pause()
    function next(_err) {
      req.resume()
      return _next()
    }

    if (req.remote_user != null && req.remote_user.name !== undefined)
      return next()

    req.remote_user = AnonymousUser()

    var token = req.cookies.get('token')
    if (token == null) return next()

    /*try {
      var user = self.decode_token(token, 60*60)
    } catch(err) {
      return next()
    }

    req.remote_user = AuthenticatedUser(user.u, user.g)
    req.remote_user.token = token
    next()*/
    var credentials = self.aes_decrypt(Buffer(token, 'base64')).toString('utf8')
    if (!credentials) return next()

    var index = credentials.indexOf(':')
    if (index < 0) return next()

    var user = credentials.slice(0, index)
    var pass = credentials.slice(index + 1)

    self.authenticate(user, pass, function(err, user) {
      if (!err) {
        req.remote_user = user
        next()
      } else {
        req.remote_user = AnonymousUser()
        next(err)
      }
    })
  }
}

Auth.prototype.issue_token = function(user) {
  var data = jju.stringify({
    u: user.name,
    g: user.real_groups && user.real_groups.length ? user.real_groups : undefined,
    t: ~~(Date.now()/1000),
  }, { indent: false })

  data = Buffer(data, 'utf8')
  var mac = Crypto.createHmac('sha256', this.secret).update(data).digest()
  return Buffer.concat([ data, mac ]).toString('base64')
}

Auth.prototype.decode_token = function(str, expire_time) {
  var buf = Buffer(str, 'base64')
  if (buf.length <= 32) throw Error[401]('invalid token')

  var data      = buf.slice(0, buf.length - 32)
  var their_mac = buf.slice(buf.length - 32)
  var good_mac  = Crypto.createHmac('sha256', this.secret).update(data).digest()

  their_mac = Crypto.createHash('sha512').update(their_mac).digest('hex')
  good_mac  = Crypto.createHash('sha512').update(good_mac).digest('hex')
  if (their_mac !== good_mac) throw Error[401]('bad signature')

  // make token expire in 24 hours
  // TODO: make configurable?
  expire_time = expire_time || 24*60*60

  data = jju.parse(data.toString('utf8'))
  if (Math.abs(data.t - ~~(Date.now()/1000)) > expire_time)
    throw Error[401]('token expired')

  return data
}

Auth.prototype.aes_encrypt = function(buf) {
  var c = Crypto.createCipher('aes192', this.secret)
  var b1 = c.update(buf)
  var b2 = c.final()
  return Buffer.concat([ b1, b2 ])
}

Auth.prototype.aes_decrypt = function(buf) {
  try {
    var c = Crypto.createDecipher('aes192', this.secret)
    var b1 = c.update(buf)
    var b2 = c.final()
  } catch(_) {
    return Buffer(0)
  }
  return Buffer.concat([ b1, b2 ])
}

function AnonymousUser() {
  return {
    name: undefined,
    // groups without '$' are going to be deprecated eventually
    groups: [ '$all', '$anonymous', '@all', '@anonymous', 'all', 'undefined', 'anonymous' ],
    real_groups: [],
  }
}

function AuthenticatedUser(name, groups) {
  var _groups = (groups || []).concat([ '$all', '$authenticated', '@all', '@authenticated', 'all' ])
  return {
    name: name,
    groups: _groups,
    real_groups: groups,
  }
}

