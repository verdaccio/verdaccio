'use strict';

const assert = require('assert');
const config_hash = require('./partials/config');
const Config = require('../../src/lib/config');


describe('Config', function() {
  before(function() {
    this.config = new Config(config_hash);
  });

  it('npmjs uplink should have a default cache option that is true', function() {
    assert.equal(this.config.uplinks['npmjs'].cache, true);
  });
});

