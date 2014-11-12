var assert    = require('assert')
var Crypto    = require('crypto')
var Error     = require('http-errors')
var minimatch = require('minimatch')
var Path      = require('path')
var LocalList = require('./local-list')
var Utils     = require('./utils')

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

  // some weird shell scripts are valid yaml files parsed as string
  assert.equal(typeof(config), 'object', 'CONFIG: it doesn\'t look like a valid config file')

  assert(self.storage, 'CONFIG: storage path not defined')
  self.localList = LocalList(
    Path.join(
      Path.resolve(Path.dirname(self.self_path), self.storage),
      '.sinopia-db.json'
    )
  )

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

  function check_userlist(i, hash, action) {
    if (hash[action] == null) hash[action] = []

    // if it's a string, split it to array
    if (typeof(hash[action]) === 'string') {
      hash[action] = hash[action].split(/\s+/)
    }

    assert(
      typeof(hash[action]) === 'object' &&
      Array.isArray(hash[action])
    , 'CONFIG: bad "'+i+'" package '+action+' description (array or string expected)')
    hash[action] = flatten(hash[action])
  }

  for (var i in self.packages) {
    assert(
      typeof(self.packages[i]) === 'object' &&
      !Array.isArray(self.packages[i])
    , 'CONFIG: bad "'+i+'" package description (object expected)')

    check_userlist(i, self.packages[i], 'allow_access')
    check_userlist(i, self.packages[i], 'allow_publish')
    check_userlist(i, self.packages[i], 'proxy_access')
    check_userlist(i, self.packages[i], 'proxy_publish')

    // deprecated
    check_userlist(i, self.packages[i], 'access')
    check_userlist(i, self.packages[i], 'proxy')
    check_userlist(i, self.packages[i], 'publish')
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

  if (self.ignore_latest_tag == null) self.ignore_latest_tag = false

  return self
}

function allow_action(package, who, action) {
  return (this.get_package_setting(package, action) || []).reduce(function(prev, curr) {
    if (typeof(who) === 'string' && curr === who) return true
    if (Array.isArray(who) && who.indexOf(curr) !== -1) return true
    return prev
  }, false)
}

Config.prototype.allow_access = function(package, user) {
  return allow_action.call(this, package, user.groups, 'allow_access')
      || allow_action.call(this, package, user.groups, 'access')
}

Config.prototype.allow_publish = function(package, user) {
  return allow_action.call(this, package, user.groups, 'allow_publish')
      || allow_action.call(this, package, user.groups, 'publish')
}

Config.prototype.proxy_access = function(package, uplink) {
  return allow_action.call(this, package, uplink, 'proxy_access')
      || allow_action.call(this, package, uplink, 'proxy')
}

Config.prototype.proxy_publish = function(package, uplink) {
  throw Error('deprecated')
  //return allow_action.call(this, package, uplink, 'proxy_publish')
}

Config.prototype.get_package_setting = function(package, setting) {
  for (var i in this.packages) {
    if (minimatch.makeRe(i).exec(package)) {
      return this.packages[i][setting]
    }
  }
  return undefined
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

