'use strict';

const JSONStream = require('JSONStream');
const Error = require('http-errors');
const request = require('request');
const Stream = require('readable-stream');
const URL = require('url');
const parse_interval = require('./config').parse_interval;
const Logger = require('./logger');
const MyStreams = require('./streams');
const Utils = require('./utils');
const encode = function(thing) {
  return encodeURIComponent(thing).replace(/^%40/, '@');
};

/**
 * Implements Storage interface
 * (same for storage.js, local-storage.js, up-storage.js)
 */
class Storage {

  /**
   * Constructor
   * @param {*} config
   * @param {*} mainconfig
   */
  constructor(config, mainconfig) {
    this.config = config;
    this.failed_requests = 0;
    this.userAgent = mainconfig.user_agent;
    this.ca = config.ca;
    this.logger = Logger.logger.child({sub: 'out'});
    this.server_id = mainconfig.server_id;

    this.url = URL.parse(this.config.url);
    this._setupProxy(this.url.hostname, config, mainconfig, this.url.protocol === 'https:');
    this.config.url = this.config.url.replace(/\/$/, '');
    if (Number(this.config.timeout) >= 1000) {
      this.logger.warn(['Too big timeout value: ' + this.config.timeout,
                        'We changed time format to nginx-like one',
                        '(see http://wiki.nginx.org/ConfigNotation)',
                        'so please update your config accordingly'].join('\n'));
    }

    // a bunch of different configurable timers
    this.maxage = parse_interval(config_get('maxage', '2m' ));
    this.timeout = parse_interval(config_get('timeout', '30s'));
    this.max_fails = Number(config_get('max_fails', 2 ));
    this.fail_timeout = parse_interval(config_get('fail_timeout', '5m' ));
    return this;

    /**
     * Just a helper (`config[key] || default` doesn't work because of zeroes)
     * @param {*} key
     * @param {*} def
     * @return {String}
     */
    function config_get(key, def) {
      return config[key] != null ? config[key] : def;
    }
  }

  /**
   * Set up a proxy.
   * @param {*} hostname
   * @param {*} config
   * @param {*} mainconfig
   * @param {*} isHTTPS
   */
  _setupProxy(hostname, config, mainconfig, isHTTPS) {
    let no_proxy;
    let proxy_key = isHTTPS ? 'https_proxy' : 'http_proxy';

    // get http_proxy and no_proxy configs
    if (proxy_key in config) {
      this.proxy = config[proxy_key];
    } else if (proxy_key in mainconfig) {
      this.proxy = mainconfig[proxy_key];
    }
    if ('no_proxy' in config) {
      no_proxy = config.no_proxy;
    } else if ('no_proxy' in mainconfig) {
      no_proxy = mainconfig.no_proxy;
    }

    // use wget-like algorithm to determine if proxy shouldn't be used
    if (hostname[0] !== '.') {
      hostname = '.' + hostname;
    }
    if (typeof(no_proxy) === 'string' && no_proxy.length) {
      no_proxy = no_proxy.split(',');
    }
    if (Array.isArray(no_proxy)) {
      for (let i=0; i<no_proxy.length; i++) {
        let no_proxy_item = no_proxy[i];
        if (no_proxy_item[0] !== '.') no_proxy_item = '.' + no_proxy_item;
        if (hostname.lastIndexOf(no_proxy_item) === hostname.length - no_proxy_item.length) {
          if (this.proxy) {
            this.logger.debug({url: this.url.href, rule: no_proxy_item},
              'not using proxy for @{url}, excluded by @{rule} rule');
            this.proxy = false;
          }
          break;
        }
      }
    }

    // if it's non-string (i.e. "false"), don't use it
    if (typeof(this.proxy) !== 'string') {
      delete this.proxy;
    } else {
      this.logger.debug( {url: this.url.href, proxy: this.proxy}
                      , 'using proxy @{proxy} for @{url}' );
    }
  }

  /**
   * Fetch an asset.
   * @param {*} options
   * @param {*} cb
   * @return {Request}
   */
  request(options, cb) {
    let json;
    if (!this.status_check()) {
      let req = new Stream.Readable();
      process.nextTick(function() {
        if (typeof(cb) === 'function') cb(Error('uplink is offline'));
        req.emit('error', Error('uplink is offline'));
      });
      req._read = function() {};
      // preventing 'Uncaught, unspecified "error" event'
      req.on('error', function() {});
      return req;
    }

    let self = this;
    let headers = options.headers || {};
    headers['Accept'] = headers['Accept'] || 'application/json';
    headers['Accept-Encoding'] = headers['Accept-Encoding'] || 'gzip';
    // registry.npmjs.org will only return search result if user-agent include string 'npm'
    headers['User-Agent'] = headers['User-Agent'] || `npm (${this.userAgent})`;
    this._add_proxy_headers(options.req, headers);

    // add/override headers specified in the config
    for (let key in this.config.headers) {
      if (Object.prototype.hasOwnProperty.call(this.config.headers, key)) {
        headers[key] = this.config.headers[key];
      }
    }

    let method = options.method || 'GET';
    let uri = options.uri_full || (this.config.url + options.uri);

    self.logger.info({
      method: method,
      headers: headers,
      uri: uri,
    }, 'making request: \'@{method} @{uri}\'');

    if (Utils.is_object(options.json)) {
      json = JSON.stringify(options.json);
      headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    }

    let request_callback = cb ? (function(err, res, body) {
      let error;
      let res_length = err ? 0 : body.length;

      do_decode();
      do_log();
      cb(err, res, body);

      /**
       * Perform a decode.
       */
      function do_decode() {
        if (err) {
          error = err.message;
          return;
        }

        if (options.json && res.statusCode < 300) {
          try {
            body = JSON.parse(body.toString('utf8'));
          } catch(_err) {
            body = {};
            err = _err;
            error = err.message;
          }
        }

        if (!err && Utils.is_object(body)) {
          if (typeof(body.error) === 'string') {
            error = body.error;
          }
        }
      }
      /**
       * Perform a log.
       */
      function do_log() {
        let message = '@{!status}, req: \'@{request.method} @{request.url}\'';
        message += error
                ? ', error: @{!error}'
                : ', bytes: @{bytes.in}/@{bytes.out}';
        self.logger.warn({
          err: err,
          request: {method: method, url: uri},
          level: 35, // http
          status: res != null ? res.statusCode : 'ERR',
          error: error,
          bytes: {
            in: json ? json.length : 0,
            out: res_length || 0,
          },
        }, message);
      }
    }) : undefined;

    const req = request({
      url: uri,
      method: method,
      headers: headers,
      body: json,
      ca: this.ca,
      proxy: this.proxy,
      encoding: null,
      gzip: true,
      timeout: this.timeout,
    }, request_callback);

    let status_called = false;
    req.on('response', function(res) {
      if (!req._verdaccio_aborted && !status_called) {
        status_called = true;
        self.status_check(true);
      }

      if (!request_callback) {
        (function do_log() {
          let message = '@{!status}, req: \'@{request.method} @{request.url}\' (streaming)';
          self.logger.warn({
            request: {method: method, url: uri},
            level: 35, // http
            status: res != null ? res.statusCode : 'ERR',
          }, message);
        })();
      }
    });
    req.on('error', function(_err) {
      if (!req._verdaccio_aborted && !status_called) {
        status_called = true;
        self.status_check(false);
      }
    });
    return req;
  }

  /**
   * Check whether the remote host is available.
   * @param {*} alive
   * @return {Boolean}
   */
  status_check(alive) {
    if (arguments.length === 0) {
      if (this.failed_requests >= this.max_fails
      && Math.abs(Date.now() - this.last_request_time) < this.fail_timeout) {
        return false;
      } else {
        return true;
      }
    } else {
      if (alive) {
        if (this.failed_requests >= this.max_fails) {
          this.logger.warn({host: this.url.host}, 'host @{host} is back online');
        }
        this.failed_requests = 0;
      } else {
        this.failed_requests++;
        if (this.failed_requests === this.max_fails) {
          this.logger.warn({host: this.url.host}, 'host @{host} is now offline');
        }
      }
      this.last_request_time = Date.now();
    }
  }

  /**
   * Determine whether can fetch from the provided URL.
   * @param {*} url
   * @return {Boolean}
   */
  can_fetch_url(url) {
    url = URL.parse(url);
    return url.protocol === this.url.protocol
        && url.host === this.url.host
        && url.path.indexOf(this.url.path) === 0;
  }

  /**
   * Get a remote package.
   * @param {*} name
   * @param {*} options
   * @param {*} callback
   */
  get_package(name, options, callback) {
    if (typeof(options) === 'function') {
      callback = options;
      options = {};
    }
    const headers = {};
    if (options.etag) {
      headers['If-None-Match'] = options.etag;
      headers['Accept'] = 'application/octet-stream';
    }

    this.request({
      uri: `/${encode(name)}`,
      json: true,
      headers: headers,
      req: options.req,
    }, function(err, res, body) {
      if (err) return callback(err);
      if (res.statusCode === 404) {
        return callback( Error[404]('package doesn\'t exist on uplink') );
      }
      if (!(res.statusCode >= 200 && res.statusCode < 300)) {
        let error = Error('bad status code: ' + res.statusCode);
        error.remoteStatus = res.statusCode;
        return callback(error);
      }
      callback(null, body, res.headers.etag);
    });
  }

  /**
   * Retrieve a tarball.
   * @param {*} name
   * @param {*} options
   * @param {*} filename
   * @return {Stream}
   */
  get_tarball(name, options, filename) {
    // FUTURE: es6 note: this must be default parameter
    if (!options) {
      options = {};
    }
    return this.get_url(`${this.config.url}'/'${name}/-/${filename}`);
  }

  /**
   * Get an url.
   * @param {String} url
   * @return {Stream}
   */
  get_url(url) {
    const stream = MyStreams.ReadTarballStream();
    stream.abort = function() {};
    let current_length = 0;
    let expected_length;
    let rstream = this.request({
      uri_full: url,
      encoding: null,
      headers: {Accept: 'application/octet-stream'},
    });

    rstream.on('response', function(res) {
      if (res.statusCode === 404) {
        return stream.emit('error', Error[404]('file doesn\'t exist on uplink'));
      }
      if (!(res.statusCode >= 200 && res.statusCode < 300)) {
        return stream.emit('error', Error('bad uplink status code: ' + res.statusCode));
      }
      if (res.headers['content-length']) {
        expected_length = res.headers['content-length'];
        stream.emit('content-length', res.headers['content-length']);
      }

      rstream.pipe(stream);
    });

    rstream.on('error', function(err) {
      stream.emit('error', err);
    });
    rstream.on('data', function(d) {
      current_length += d.length;
    });
    rstream.on('end', function(d) {
      if (d) current_length += d.length;
      if (expected_length && current_length != expected_length)
        stream.emit('error', Error('content length mismatch'));
    });
    return stream;
  }

  /**
   * Perform a stream search.
   * @param {*} startkey keyword
   * @param {*} options request options
   * @return {Stream}
   */
  search(startkey, options) {
    const stream = new Stream.PassThrough({objectMode: true});
    let req = this.request({
      uri: options.req.url,
      req: options.req,
      headers: {
        referer: options.req.headers.referer,
      },
    });

    req.on('response', (res) => {
      if (!String(res.statusCode).match(/^2\d\d$/)) {
        return stream.emit('error', Error('bad status code ' + res.statusCode + ' from uplink'));
      }

      res.pipe(JSONStream.parse('*')).on('data', (pkg) => {
        if (Utils.is_object(pkg)) {
          stream.emit('data', pkg);
        }
      });

      res.on('end', () => {
        stream.emit('end');
      });
    });

    req.on('error', (err) => {
      stream.emit('error', err);
    });

    stream.abort = () => {
      req.abort();
      stream.emit('end');
    };

    return stream;
  }

  /**
   * Add proxy headers.
   * @param {*} req the http request
   * @param {*} headers the request headers
   */
  _add_proxy_headers(req, headers) {
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
        ) + req.connection.remoteAddress;
      }
    }

    // always attach Via header to avoid loops, even if we're not proxying
    headers['Via'] =
      req && req.headers['via']
      ? req.headers['via'] + ', '
      : '';

    headers['Via'] += '1.1 ' + this.server_id + ' (Verdaccio)';
  }

}

module.exports = Storage;
