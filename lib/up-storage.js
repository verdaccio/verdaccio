var JSONStream     = require('JSONStream')
var Error          = require('http-errors')
var request        = require('request')
var Stream         = require('readable-stream')
var URL            = require('url')
var parse_interval = require('./config').parse_interval
var Logger         = require('./logger')
var MyStreams      = require('./streams')
var Utils          = require('./utils')
var encode         = function(thing) {
  return encodeURIComponent(thing).replace(/^%40/, '@');
};

module.exports = Storage

//
// Implements Storage interface
// (same for storage.js, local-storage.js, up-storage.js)
//
function Storage(config, mainconfig) {
  var self = Object.create(Storage.prototype)
  self.config = config
  self.failed_requests = 0
  self.userAgent = mainconfig.user_agent
  self.ca = config.ca
  self.logger = Logger.logger.child({sub: 'out'})
  self.server_id = mainconfig.server_id

  self.url = URL.parse(self.config.url)

  _setupProxy.call(self, self.url.hostname, config, mainconfig, self.url.protocol === 'https:')

  self.config.url = self.config.url.replace(/\/$/, '')
  if (Number(self.config.timeout) >= 1000) {
    self.logger.warn([ 'Too big timeout value: ' + self.config.timeout,
                       'We changed time format to nginx-like one',
                       '(see http://wiki.nginx.org/ConfigNotation)',
                       'so please update your config accordingly' ].join('\n'))
  }

  // a bunch of different configurable timers
  self.maxage       = parse_interval(config_get('maxage'      , '2m' ))
  self.timeout      = parse_interval(config_get('timeout'     , '30s'))
  self.max_fails    =         Number(config_get('max_fails'   ,  2   ))
  self.fail_timeout = parse_interval(config_get('fail_timeout', '5m' ))
  return self

  // just a helper (`config[key] || default` doesn't work because of zeroes)
  function config_get(key, def) {
    return config[key] != null ? config[key] : def
  }
}

function _setupProxy(hostname, config, mainconfig, isHTTPS) {
  var no_proxy
  var proxy_key = isHTTPS ? 'https_proxy' : 'http_proxy'

  // get http_proxy and no_proxy configs
  if (proxy_key in config) {
    this.proxy = config[proxy_key]
  } else if (proxy_key in mainconfig) {
    this.proxy = mainconfig[proxy_key]
  }
  if ('no_proxy' in config) {
    no_proxy = config.no_proxy
  } else if ('no_proxy' in mainconfig) {
    no_proxy = mainconfig.no_proxy
  }

  // use wget-like algorithm to determine if proxy shouldn't be used
  if (hostname[0] !== '.') hostname = '.' + hostname
  if (typeof(no_proxy) === 'string' && no_proxy.length) {
    no_proxy = no_proxy.split(',')
  }
  if (Array.isArray(no_proxy)) {
    for (var i=0; i<no_proxy.length; i++) {
      var no_proxy_item = no_proxy[i]
      if (no_proxy_item[0] !== '.') no_proxy_item = '.' + no_proxy_item
      if (hostname.lastIndexOf(no_proxy_item) === hostname.length - no_proxy_item.length) {
        if (this.proxy) {
          this.logger.debug({url: this.url.href, rule: no_proxy_item},
            'not using proxy for @{url}, excluded by @{rule} rule')
          this.proxy = false
        }
        break
      }
    }
  }

  // if it's non-string (i.e. "false"), don't use it
  if (typeof(this.proxy) !== 'string') {
    delete this.proxy
  } else {
    this.logger.debug( { url: this.url.href, proxy: this.proxy }
                     , 'using proxy @{proxy} for @{url}' )
  }
}

Storage.prototype.request = function(options, cb) {
  if (!this.status_check()) {
    var req = new Stream.Readable()
    process.nextTick(function() {
      if (typeof(cb) === 'function') cb(Error('uplink is offline'))
      req.emit('error', Error('uplink is offline'))
    })
    req._read = function(){}
    // preventing 'Uncaught, unspecified "error" event'
    req.on('error', function(){})
    return req
  }

  var self = this
  var headers = options.headers || {}
  headers['Accept']          = headers['Accept']          || 'application/json'
  headers['Accept-Encoding'] = headers['Accept-Encoding'] || 'gzip'
  headers['User-Agent']      = headers['User-Agent']      || this.userAgent
  this._add_proxy_headers(options.req, headers)

  var method = options.method   || 'GET'
  var uri    = options.uri_full || (this.config.url + options.uri)

  self.logger.info({
    method  : method,
    headers : headers,
    uri     : uri,
  }, "making request: '@{method} @{uri}'")

  if (Utils.is_object(options.json)) {
    var json = JSON.stringify(options.json)
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  }

  var request_callback = cb ? (function (err, res, body) {
    var error
    var res_length = err ? 0 : body.length

    do_decode()
    do_log()
    cb(err, res, body)

    function do_decode() {
      if (err) {
        error = err.message
        return
      }

      if (options.json && res.statusCode < 300) {
        try {
          body = JSON.parse(body.toString('utf8'))
        } catch(_err) {
          body = {}
          err = _err
          error = err.message
        }
      }

      if (!err && Utils.is_object(body)) {
        if (typeof(body.error) === 'string') {
          error = body.error
        }
      }
    }

    function do_log() {
      var message = '@{!status}, req: \'@{request.method} @{request.url}\''
      message += error
               ? ', error: @{!error}'
               : ', bytes: @{bytes.in}/@{bytes.out}'
      self.logger.warn({
        err     : err,
        request : { method: method, url: uri },
        level   : 35, // http
        status  : res != null ? res.statusCode : 'ERR',
        error   : error,
        bytes   : {
          in  : json ? json.length : 0,
          out : res_length || 0,
        }
      }, message)
    }
  }) : undefined

  var req = request({
    url      : uri,
    method   : method,
    headers  : headers,
    body     : json,
    ca       : this.ca,
    proxy    : this.proxy,
    encoding : null,
    gzip     : true,
    timeout  : this.timeout,
  }, request_callback)

  var status_called = false
  req.on('response', function(res) {
    if (!req._sinopia_aborted && !status_called) {
      status_called = true
      self.status_check(true)
    }

    if (!request_callback) {
      ;(function do_log() {
        var message = '@{!status}, req: \'@{request.method} @{request.url}\' (streaming)'
        self.logger.warn({
          request : { method: method, url: uri },
          level   : 35, // http
          status  : res != null ? res.statusCode : 'ERR',
        }, message)
      })()
    }
  })
  req.on('error', function(_err) {
    if (!req._sinopia_aborted && !status_called) {
      status_called = true
      self.status_check(false)
    }
  })
  return req
}

Storage.prototype.status_check = function(alive) {
  if (arguments.length === 0) {
    if (this.failed_requests >= this.max_fails
     && Math.abs(Date.now() - this.last_request_time) < this.fail_timeout) {
      return false
    } else {
      return true
    }
  } else {
    if (alive) {
      if (this.failed_requests >= this.max_fails) {
        this.logger.warn({ host: this.url.host }, 'host @{host} is back online')
      }
      this.failed_requests = 0
    } else {
      this.failed_requests++
      if (this.failed_requests === this.max_fails) {
        this.logger.warn({ host: this.url.host }, 'host @{host} is now offline')
      }
    }
    this.last_request_time = Date.now()
  }
}

Storage.prototype.can_fetch_url = function(url) {
  url = URL.parse(url)

  return url.protocol === this.url.protocol
      && url.host === this.url.host
      && url.path.indexOf(this.url.path) === 0
}

Storage.prototype.get_package = function(name, options, callback) {
  if (typeof(options) === 'function') callback = options, options = {}

  var headers = {}
  if (options.etag) {
    headers['If-None-Match'] = options.etag
    headers['Accept']        = 'application/octet-stream'
  }

  this.request({
    uri     : '/' + encode(name),
    json    : true,
    headers : headers,
    req     : options.req,
  }, function(err, res, body) {
    if (err) return callback(err)
    if (res.statusCode === 404) {
      return callback( Error[404]("package doesn't exist on uplink") )
    }
    if (!(res.statusCode >= 200 && res.statusCode < 300)) {
      var error = Error('bad status code: ' + res.statusCode)
      error.remoteStatus = res.statusCode
      return callback(error)
    }
    callback(null, body, res.headers.etag)
  })
}

Storage.prototype.get_tarball = function(name, options, filename) {
  if (!options) options = {}
  return this.get_url(this.config.url + '/' + name + '/-/' + filename)
}

Storage.prototype.get_url = function(url) {
  var stream = MyStreams.ReadTarballStream()
  stream.abort = function() {}
  var current_length = 0, expected_length

  var rstream = this.request({
    uri_full: url,
    encoding: null,
    headers: { Accept: 'application/octet-stream' },
  })

  rstream.on('response', function(res) {
    if (res.statusCode === 404) {
      return stream.emit('error', Error[404]("file doesn't exist on uplink"))
    }
    if (!(res.statusCode >= 200 && res.statusCode < 300)) {
      return stream.emit('error', Error('bad uplink status code: ' + res.statusCode))
    }
    if (res.headers['content-length']) {
      expected_length = res.headers['content-length']
      stream.emit('content-length', res.headers['content-length'])
    }

    rstream.pipe(stream)
  })

  rstream.on('error', function(err) {
    stream.emit('error', err)
  })
  rstream.on('data', function(d) {
    current_length += d.length
  })
  rstream.on('end', function(d) {
    if (d) current_length += d.length
    if (expected_length && current_length != expected_length)
      stream.emit('error', Error('content length mismatch'))
  })
  return stream
}

Storage.prototype.search = function(startkey, options) {
  var self = this

  var stream = new Stream.PassThrough({ objectMode: true })

  var req = self.request({
    uri: options.req.url,
    req: options.req,
  })

  req.on('response', function (res) {
    if (!String(res.statusCode).match(/^2\d\d$/)) {
      return stream.emit('error', Error('bad status code ' + res.statusCode + ' from uplink'))
    }

    res.pipe(JSONStream.parse('*')).on('data', function (pkg) {
      if (Utils.is_object(pkg)) {
        stream.emit('data', pkg)
      }
    })

    res.on('end', function () {
      stream.emit('end')
    })
  })

  req.on('error', function (err) {
    stream.emit('error', err)
  })

  stream.abort = function () {
    req.abort()
    stream.emit('end')
  }

  return stream
}

Storage.prototype._add_proxy_headers = function(req, headers) {
  if (req) {
    // Only submit X-Forwarded-For field if we don't have a proxy selected
    // in the config file.
    //
    // Otherwise misconfigured proxy could return 407:
    // https://github.com/rlidwka/sinopia/issues/254
    //
    if (!this.proxy) {
      headers['X-Forwarded-For'] = (
        req && req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'] + ', '
        : ''
      ) + req.connection.remoteAddress
    }
  }

  // always attach Via header to avoid loops, even if we're not proxying
  headers['Via'] =
    req && req.headers['via']
    ? req.headers['via'] + ', '
    : ''

  headers['Via'] += '1.1 ' + this.server_id + ' (Sinopia)'
}

