'use strict';

const assert = require('assert')
const loggerPath = require.resolve('../../src/lib/logger');

describe('logger', function () {
  it('returns a default instance', function () {
    delete require.cache[loggerPath];
    const log = require(loggerPath)();
    assert(log.level, 'info');
  });

  it('returns a new instance', function () {
    delete require.cache[loggerPath];
    const one = require(loggerPath)();
    const two = require(loggerPath)({}, true);
    assert(one !== two);
  });

  it('returns a new instance with config', function () {
    delete require.cache[loggerPath];
    const one = require(loggerPath)();
    const two = require(loggerPath)({level: 'fatal'}, true);
    assert(one !== two);
    assert(one.level, 'info');
    assert(two.level, 'fatal');
  });

  it('returns a new instance without config', function () {
    delete require.cache[loggerPath];
    const one = require(loggerPath)();
    const two = require(loggerPath)(null, true);
    assert(one !== two);
    assert(one.level, 'info');
    assert(two.level, 'info');
  });
});
