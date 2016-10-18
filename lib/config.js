var assert    = require('assert')
var Crypto    = require('crypto')
var Error     = require('http-errors')
var minimatch = require('minimatch')
var Path      = require('path')
var LocalData = require('./local-data')
var Utils     = require('./utils')
var Utils     = require('./utils')
var pkginfo = require('pkginfo')(module) // eslint-disable-line no-unused-vars
var pkgVersion = module.exports.version
var pkgName    = module.exports.name

// [[a, [b, c]], d] -> [a, b, c, d]
function flatten(array) {
  var result = []
  for (var i=0; i<array.length; i++) {
    if (Array.isArray(array[i])) {
      result.push.apply(result, flatten(array[i]))
    } else {
      result.push(array[i])
    }
  }
  return result
}

function Config(config) {
  var self = Object.create(Config.prototype)
  for (var i in config) {
    if (self[i] == null) self[i] = config[i]
  }
  if (!self.user_agent) self.user_agent = pkgName + '/' + pkgVersion

  // some weird shell scripts are valid yaml files parsed as string
  assert.equal(typeof(config), 'object', 'CONFIG: it doesn\'t look like a valid config file')

  assert(self.storage, 'CONFIG: storage path not defined')
  self.localList = LocalData(
    Path.join(
      Path.resolve(Path.dirname(self.self_path || ''), self.storage),
      '.sinopia-db.json'
    )
  )
  if (!self.secret) {
    self.secret = self.localList.data.secret

    if (!self.secret) {
      self.secret = Crypto.pseudoRandomBytes(32).toString('hex')
      self.localList.data.secret = self.secret
      self.localList.sync()
    }
  }

  var users = {all:true, anonymous:true, 'undefined':true, owner:true, none:true}

  var check_user_or_uplink = function(arg) {
    assert(arg !== 'all' && arg !== 'owner' && arg !== 'anonymous' && arg !== 'undefined' && arg !== 'none', 'CONFIG: reserved user/uplink name: ' + arg)
    assert(!arg.match(/\s/), 'CONFIG: invalid user name: ' + arg)
    assert(users[arg] == null, 'CONFIG: duplicate user/uplink name: ' + arg)
    users[arg] = true
  }

  ;[ 'users', 'uplinks', 'packages' ].forEach(function(x) {
    if (self[x] == null) self[x] = {}
    assert(Utils.is_object(self[x]), 'CONFIG: bad "'+x+'" value (object expected)')
  })

  for (var i in self.users) check_user_or_uplink(i)
  for (var i in self.uplinks) check_user_or_uplink(i)

  for (var i in self.users) {
    assert(self.users[i].password, 'CONFIG: no password for user: ' + i)
    assert(
      typeof(self.users[i].password) === 'string' &&
      self.users[i].password.match(/^[a-f0-9]{40}$/)
    , 'CONFIG: wrong password format for user: ' + i + ', sha1 expected')
  }

  for (var i in self.uplinks) {
    assert(self.uplinks[i].url, 'CONFIG: no url for uplink: ' + i)
    assert( typeof(self.uplinks[i].url) === 'string'
          , 'CONFIG: wrong url format for uplink: ' + i)
    self.uplinks[i].url = self.uplinks[i].url.replace(/\/$/, '')
  }

  function normalize_userlist() {
    var result = []

    for (var i=0; i<arguments.length; i++) {
      if (arguments[i] == null) continue

      // if it's a string, split it to array
      if (typeof(arguments[i]) === 'string') {
        result.push(arguments[i].split(/\s+/))
      } else if (Array.isArray(arguments[i])) {
        result.push(arguments[i])
      } else {
        throw Error('CONFIG: bad package acl (array or string expected): ' + JSON.stringify(arguments[i]))
      }
    }
    return flatten(result)
  }

  // add a default rule for all packages to make writing plugins easier
  if (self.packages['**'] == null) {
    self.packages['**'] = {}
  }

  for (var i in self.packages) {
    assert(
      typeof(self.packages[i]) === 'object' &&
      !Array.isArray(self.packages[i])
    , 'CONFIG: bad "'+i+'" package description (object expected)')

    self.packages[i].access = normalize_userlist(
      self.packages[i].allow_access,
      self.packages[i].access
    );
    delete self.packages[i].allow_access

    self.packages[i].publish = normalize_userlist(
      self.packages[i].allow_publish,
      self.packages[i].publish
    );
    delete self.packages[i].allow_publish

    self.packages[i].proxy = normalize_userlist(
      self.packages[i].proxy_access,
      self.packages[i].proxy
    );
    delete self.packages[i].proxy_access
  }

  // loading these from ENV if aren't in config
  ;[ 'http_proxy', 'https_proxy', 'no_proxy' ].forEach((function(v) {
    if (!(v in self)) {
      self[v] = process.env[v] || process.env[v.toUpperCase()]
    }
  }).bind(self))

  // unique identifier of self server (or a cluster), used to avoid loops
  if (!self.server_id) {
    self.server_id = Crypto.pseudoRandomBytes(6).toString('hex')
  }

  return self
}

Config.prototype.can_proxy_to = function(package, uplink) {
  return (this.get_package_spec(package).proxy || []).reduce(function(prev, curr) {
    if (uplink === curr) return true
    return prev
  }, false)
}

Config.prototype.get_package_spec = function(package) {
  for (var i in this.packages) {
    if (minimatch.makeRe(i).exec(package)) {
      return this.packages[i]
    }
  }
  return {}
}

module.exports = Config

var parse_interval_table = {
  '': 1000,
  ms: 1,
  s: 1000,
  m: 60*1000,
  h: 60*60*1000,
  d: 86400000,
  w: 7*86400000,
  M: 30*86400000,
  y: 365*86400000,
}

module.exports.parse_interval = function(interval) {
  if (typeof(interval) === 'number') return interval * 1000

  var result = 0
  var last_suffix = Infinity
  interval.split(/\s+/).forEach(function(x) {
    if (!x) return
    var m = x.match(/^((0|[1-9][0-9]*)(\.[0-9]+)?)(ms|s|m|h|d|w|M|y|)$/)
    if (!m
    ||  parse_interval_table[m[4]] >= last_suffix
    ||  (m[4] === '' && last_suffix !== Infinity)) {
      throw Error('invalid interval: ' + interval)
    }
    last_suffix = parse_interval_table[m[4]]
    result += Number(m[1]) * parse_interval_table[m[4]]
  })
  return result
}

