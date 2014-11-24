var Keygrip = require('keygrip')
var http = require('http')
var cache = {}

function Cookies(request, response, keys) {
  if (!(this instanceof Cookies)) return new Cookies(request, response, keys)

  this.request = request
  this.response = response
  if (keys) {
    // array of key strings
    if (Array.isArray(keys))
      this.keys = new Keygrip(keys)
    // any keygrip constructor to allow different versions
    else if (keys.constructor && keys.constructor.name === 'Keygrip')
      this.keys = keys
  }
}

Cookies.prototype = {
  get: function(name, opts) {
    var sigName = name + ".sig"
      , header, match, value, remote, data, index
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    header = this.request.headers["cookie"]
    if (!header) return

    match = header.match(getPattern(name))
    if (!match) return

    value = match[1]
    if (!opts || !signed) return value

    remote = this.get(sigName)
    if (!remote) return

    data = name + "=" + value
    if (!this.keys) throw new Error('.keys required for signed cookies');
    index = this.keys.index(data, remote)

    if (index < 0) {
      this.set(sigName, null, {path: "/", signed: false })
    } else {
      index && this.set(sigName, this.keys.sign(data), { signed: false })
      return value
    }
  },

  set: function(name, value, opts) {
    var res = this.response
      , req = this.request
      , headers = res.getHeader("Set-Cookie") || []
      , secure = req.protocol === 'https' || req.connection.encrypted
      , cookie = new Cookie(name, value, opts)
      , signed = opts && opts.signed !== undefined ? opts.signed : !!this.keys

    if (typeof headers == "string") headers = [headers]

    if (!secure && opts && opts.secure) {
      throw new Error('Cannot send secure cookie over unencrypted connection')
    }

    cookie.secure = secure
    if (opts && "secure" in opts) cookie.secure = opts.secure
    if (opts && "secureProxy" in opts) cookie.secure = opts.secureProxy
    headers = pushCookie(headers, cookie)

    if (opts && signed) {
      if (!this.keys) throw new Error('.keys required for signed cookies');
      cookie.value = this.keys.sign(cookie.toString())
      cookie.name += ".sig"
      headers = pushCookie(headers, cookie)
    }

    var setHeader = res.set ? http.OutgoingMessage.prototype.setHeader : res.setHeader
    setHeader.call(res, 'Set-Cookie', headers)
    return this
  }
}

function Cookie(name, value, attrs) {
  value || (this.expires = new Date(0))

  this.name = name
  this.value = value || ""

  for (var name in attrs) this[name] = attrs[name]
}

Cookie.prototype = {
  path: "/",
  expires: undefined,
  domain: undefined,
  httpOnly: true,
  secure: false,
  overwrite: false,

  toString: function() {
    return this.name + "=" + this.value
  },

  toHeader: function() {
    var header = this.toString()

    if (this.maxAge) this.expires = new Date(Date.now() + this.maxAge);

    if (this.path     ) header += "; path=" + this.path
    if (this.expires  ) header += "; expires=" + this.expires.toUTCString()
    if (this.domain   ) header += "; domain=" + this.domain
    if (this.secure   ) header += "; secure"
    if (this.httpOnly ) header += "; httponly"

    return header
  }
}

// back-compat so maxage mirrors maxAge
Object.defineProperty(Cookie.prototype, 'maxage', {
  configurable: true,
  enumerable: true,
  get: function () { return this.maxAge },
  set: function (val) { return this.maxAge = val }
});

function getPattern(name) {
  if (cache[name]) return cache[name]

  return cache[name] = new RegExp(
    "(?:^|;) *" +
    name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") +
    "=([^;]*)"
  )
}

function pushCookie(cookies, cookie) {
  if (cookie.overwrite) {
    cookies = cookies.filter(function(c) { return c.indexOf(cookie.name+'=') !== 0 })
  }
  cookies.push(cookie.toHeader())
  return cookies
}

Cookies.connect = Cookies.express = function(keys) {
  return function(req, res, next) {
    req.cookies = res.cookies = new Cookies(req, res, keys)
    next()
  }
}

Cookies.Cookie = Cookie

module.exports = Cookies
