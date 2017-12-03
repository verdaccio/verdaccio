const assert = require('assert');
const Utils = require('../../src/lib/utils');
const Config = require('../../src/lib/config');
const path = require('path');
const _ = require('lodash');

const resolveConf = (conf) =>  path.join(__dirname, `../../conf/${conf}.yaml`);

const checkUplink = (config) => {
  assert.equal(_.isObject(config.uplinks['npmjs']), true);
  assert.equal(config.uplinks['npmjs'].url, 'https://registry.npmjs.org');
};

const checkPackages = (config) => {
  assert.equal(_.isObject(config.packages), true);
  assert.equal(Object.keys(config.packages).join('|'), '@*/*|**');
  assert.equal(config.packages['@*/*'].access, '$all');
  assert.equal(config.packages['@*/*'].publish, '$authenticated');
  assert.equal(config.packages['@*/*'].proxy, 'npmjs');
  assert.equal(config.packages['**'].access, '$all');
  assert.equal(config.packages['**'].publish, '$authenticated');
  assert.equal(config.packages['**'].proxy, 'npmjs');
  assert.equal(config.uplinks['npmjs'].url, 'https://registry.npmjs.org');
};

describe('Config file', () => {
  beforeAll(function() {

    this.config = new Config(Utils.parseConfigFile(resolveConf('full')));
  });

  describe('Config file', () => {
    test('parse full.yaml', () => {
      const config = new Config(Utils.parseConfigFile(resolveConf('full')));
      checkUplink(config);
      assert.equal(config.storage, './storage');
      assert.equal(config.web.title, 'Verdaccio');
      checkPackages(config);
    });

    test('parse docker.yaml', () => {
      const config = new Config(Utils.parseConfigFile(resolveConf('docker')));
      checkUplink(config);
      assert.equal(config.storage, '/verdaccio/storage');
      assert.equal(config.auth.htpasswd.file, '/verdaccio/conf/htpasswd');
    });

    test('parse default.yaml', () => {
      const config = new Config(Utils.parseConfigFile(resolveConf('default')));
      checkUplink(config);
      assert.equal(config.storage, './storage');
      assert.equal(config.auth.htpasswd.file, './htpasswd');
    });
  });

});

