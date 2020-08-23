"use strict";

/**
 * Module dependencies.
 */
var _require = require('string_decoder'),
    StringDecoder = _require.StringDecoder;

var Stream = require('stream');

var zlib = require('zlib');
/**
 * Buffers response data events and re-emits when they're unzipped.
 *
 * @param {Request} req
 * @param {Response} res
 * @api private
 */


exports.unzip = function (req, res) {
  var unzip = zlib.createUnzip();
  var stream = new Stream();
  var decoder; // make node responseOnEnd() happy

  stream.req = req;
  unzip.on('error', function (err) {
    if (err && err.code === 'Z_BUF_ERROR') {
      // unexpected end of file is ignored by browsers and curl
      stream.emit('end');
      return;
    }

    stream.emit('error', err);
  }); // pipe to unzip

  res.pipe(unzip); // override `setEncoding` to capture encoding

  res.setEncoding = function (type) {
    decoder = new StringDecoder(type);
  }; // decode upon decompressing with captured encoding


  unzip.on('data', function (buf) {
    if (decoder) {
      var str = decoder.write(buf);
      if (str.length > 0) stream.emit('data', str);
    } else {
      stream.emit('data', buf);
    }
  });
  unzip.on('end', function () {
    stream.emit('end');
  }); // override `on` to capture data listeners

  var _on = res.on;

  res.on = function (type, fn) {
    if (type === 'data' || type === 'end') {
      stream.on(type, fn.bind(res));
    } else if (type === 'error') {
      stream.on(type, fn.bind(res));

      _on.call(res, type, fn);
    } else {
      _on.call(res, type, fn);
    }

    return this;
  };
};