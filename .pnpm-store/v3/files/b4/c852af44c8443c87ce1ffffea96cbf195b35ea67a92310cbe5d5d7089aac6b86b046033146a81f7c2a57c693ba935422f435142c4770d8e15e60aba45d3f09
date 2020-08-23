'use strict';

/**
 * Module dependencies.
 */
var methods = require('methods');
var Test = require('./lib/test');
var http = require('http');

/**
 * Test against the given `app`,
 * returning a new `Test`.
 *
 * @param {Function|Server} app
 * @return {Test}
 * @api public
 */
module.exports = function(app) {
  var obj = {};

  if (typeof app === 'function') {
    app = http.createServer(app); // eslint-disable-line no-param-reassign
  }

  methods.forEach(function(method) {
    obj[method] = function(url) {
      return new Test(app, method, url);
    };
  });

  // Support previous use of del
  obj.del = obj.delete;

  return obj;
};

/**
 * Expose `Test`
 */
module.exports.Test = Test;

/**
 * Expose the agent function
 */
module.exports.agent = require('./lib/agent');
