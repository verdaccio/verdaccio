var assert = require('assert')
  , crypto = require('crypto')
  , Path = require('path')
  , minimatch = require('minimatch')
  , UError = require('./error').UserError
  , LocalList = require('./local-list')
  , utils = require('./utils')

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
	if (!(this instanceof Config)) return new Config(config)
	for (var i in config) {
		if (this[i] == null) this[i] = config[i]
	}

	// some weird shell scripts are valid yaml files parsed as string
	assert.equal(typeof(config), 'object', 'CONFIG: this doesn\'t look like a valid config file')

	assert(this.storage, 'CONFIG: storage path not defined')
	this.localList = LocalList(Path.join(this.storage, '.sinopia-db.json'))

	var users = {all:true, anonymous:true, 'undefined':true, owner:true, none:true}

	var check_user_or_uplink = function(arg) {
		assert(arg !== 'all' && arg !== 'owner' && arg !== 'anonymous' && arg !== 'undefined' && arg !== 'none', 'CONFIG: reserved user/uplink name: ' + arg)
		assert(!arg.match(/\s/), 'CONFIG: invalid user name: ' + arg)
		assert(users[arg] == null, 'CONFIG: duplicate user/uplink name: ' + arg)
		users[arg] = true
	}

	;['users', 'uplinks', 'packages'].forEach(function(x) {
		if (this[x] == null) this[x] = {}
		assert(utils.is_object(this[x]), 'CONFIG: bad "'+x+'" value (object expected)')
	})

	for (var i in this.users) check_user_or_uplink(i)
	for (var i in this.uplinks) check_user_or_uplink(i)

	for (var i in this.users) {
		assert(this.users[i].password, 'CONFIG: no password for user: ' + i)
		assert(
			typeof(this.users[i].password) === 'string' &&
			this.users[i].password.match(/^[a-f0-9]{40}$/)
		, 'CONFIG: wrong password format for user: ' + i + ', sha1 expected')
	}

	for (var i in this.uplinks) {
		assert(this.uplinks[i].url, 'CONFIG: no url for uplink: ' + i)
		assert(
			typeof(this.uplinks[i].url) === 'string'
		, 'CONFIG: wrong url format for uplink: ' + i)
		this.uplinks[i].url = this.uplinks[i].url.replace(/\/$/, '')
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

	for (var i in this.packages) {
		assert(
			typeof(this.packages[i]) === 'object' &&
			!Array.isArray(this.packages[i])
		, 'CONFIG: bad "'+i+'" package description (object expected)')

		check_userlist(i, this.packages[i], 'allow_access')
		check_userlist(i, this.packages[i], 'allow_publish')
		check_userlist(i, this.packages[i], 'proxy_access')
		check_userlist(i, this.packages[i], 'proxy_publish')

		// deprecated
		check_userlist(i, this.packages[i], 'access')
		check_userlist(i, this.packages[i], 'proxy')
		check_userlist(i, this.packages[i], 'publish')
	}

	// loading these from ENV if aren't in config
	;['http_proxy', 'https_proxy', 'no_proxy'].forEach((function(v) {
		if (!(v in this)) {
			this[v] = process.env[v] || process.env[v.toUpperCase()]
		}
	}).bind(this))

	// unique identifier of this server (or a cluster), used to avoid loops
	if (!this.server_id) {
		this.server_id = crypto.pseudoRandomBytes(6).toString('hex')
	}

	if (this.ignore_latest_tag == null) this.ignore_latest_tag = false

	return this
}

function allow_action(package, who, action) {
	return (this.get_package_setting(package, action) || []).reduce(function(prev, curr) {
		if (typeof(who) === 'string' && curr === who) return true
		if (Array.isArray(who) && who.indexOf(curr) !== -1) return true
		return prev
	}, false)
}

Config.prototype.allow_access = function(package, user) {
	return allow_action.call(this, package, user.groups, 'allow_access') || allow_action.call(this, package, user, 'access')
}

Config.prototype.allow_publish = function(package, user) {
	return allow_action.call(this, package, user.groups, 'allow_publish') || allow_action.call(this, package, user, 'publish')
}

Config.prototype.proxy_access = function(package, uplink) {
	return allow_action.call(this, package, uplink, 'proxy_access') || allow_action.call(this, package, uplink, 'proxy')
}

Config.prototype.proxy_publish = function(package, uplink) {
	throw new Error('deprecated')
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
			throw new Error('invalid interval: ' + interval)
		}
		last_suffix = parse_interval_table[m[4]]
		result += Number(m[1]) * parse_interval_table[m[4]]
	})
	return result
}

