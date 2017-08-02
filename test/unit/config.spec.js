'use strict';

const assert = require('assert');
const Utils = require('../../src/lib/utils');
const Config = require('../../src/lib/config');
const path = require('path');
const _ = require('lodash');

const resolveConf = (conf) => {
  const fullConfigPath = path.join(__dirname, `../../conf/${conf}.yaml`);
  return fullConfigPath;
};

const validateConfigFile = (config) => {
  assert.ok(_.isObject(config.uplinks['npmjs']));
}

describe('Config file', function() {
  before(function() {

    this.config = new Config(Utils.parseConfigFile(resolveConf('full')));
  });

  describe('Config file', function() {
    it('parse full.yaml', function () {
      const config = new Config(Utils.parseConfigFile(resolveConf('full')));
      validateConfigFile(config);
    });

    it('parse docker.yaml', function () {
      const config = new Config(Utils.parseConfigFile(resolveConf('docker')));
      validateConfigFile(config);
    });

    it('parse default.yaml', function () {
      const config = new Config(Utils.parseConfigFile(resolveConf('default')));
      validateConfigFile(config);
    });
  });

  it('npmjs uplink should have a default cache option that is true', () => {
    assert.equal(this.config.uplinks['npmjs'].cache, true);
  });
});

