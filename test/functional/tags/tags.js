'use strict';

const assert = require('assert');
const _ = require('lodash');
const util = require('../lib/test.utils');
const readTags = () => util.readFile('../fixtures/tags.json');

module.exports = function() {
  let server = process.server;
  let express = process.express;

  it('tags - testing for 404', function() {
    return server.getPackage('testexp_tags')
             // shouldn't exist yet
             .status(404)
             .body_error(/no such package/);
  });

  describe('tags', function() {
    before(function() {
      express.get('/testexp_tags', function(req, res) {
        let f = readTags().toString().replace(/__NAME__/g, 'testexp_tags');
        res.send(JSON.parse(f));
      });
    });

    it('fetching package again', function() {
      return server.getPackage('testexp_tags')
               .status(200)
               .then(function(body) {
                 assert(_.isObject(body.versions['1.1.0']));
                 // note: 5.4.3 is invalid tag, 0.1.3alpha is highest semver
                 assert.equal(body['dist-tags'].latest, '1.1.0');
                 assert.equal(body['dist-tags'].bad, null);
               });
    });

    const versions = ['0.1.1alpha', '0.1.1-alpha', '0000.00001.001-alpha'];

    versions.forEach(function(ver) {
      it('fetching '+ver, function() {
        return server.request({uri: '/testexp_tags/'+ver})
                 .status(200)
                 .then(function(body) {
                   assert.equal(body.version, '0.1.1alpha');
                 });
      });
    });
  });

  describe('dist-tags methods', function() {

    before(function() {

      express.get('/testexp_tags2', function(req, res) {
        let f = readTags().toString().replace(/__NAME__/g, 'testexp_tags2');
        res.send(JSON.parse(f));
      });

    });

    // populate cache
    before(function() {
      return server.getPackage('testexp_tags2').status(200);
    });

    it('fetching tags', function() {
      return server.request({
        method: 'GET',
        uri: '/-/package/testexp_tags2/dist-tags',
      }).status(200).then(function(body) {
        const expected = {
          latest: "1.1.0"
        };

        assert.deepEqual(body, expected);
      });
    });

    it('merging tags', function() {
      return server.request({
        method: 'POST',
        uri: '/-/package/testexp_tags2/dist-tags',
        json: {
          foo: '0.1.2',
          quux: '0.1.0',
        },
      }).status(201).body_ok(/updated/).then(function() {
        return server.request({
          method: 'GET',
          uri: '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function(body) {
          const expected = {
            "latest": "1.1.0",
            "foo": "0.1.2",
            "quux": "0.1.0"
          };

          assert.deepEqual(body, expected);
        });
      });
    });

    it('should add a dist-tag called foo', function() {
      return server.request({
        method: 'PUT',
        uri: '/-/package/testexp_tags2/dist-tags/foo',
        json: '0.1.3alpha',
      }).status(201).body_ok(/tagged/).then(function() {
        return server.request({
          method: 'GET',
          uri: '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function(body) {
          const expected = {
            foo: '0.1.3alpha',
            quux: '0.1.0',
            latest: '1.1.0'
          };

        assert.deepEqual(body, expected);
        });
      });
    });

    it('should remove a dis-tag called quux', function() {
      return server.request({
        method: 'DELETE',
        uri: '/-/package/testexp_tags2/dist-tags/latest',
      }).status(201).body_ok(/removed/).then(function() {
        return server.request({
          method: 'GET',
          uri: '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function(body) {
          const expected = {
            latest: '1.1.0',
            "quux": "0.1.0",
            foo: "0.1.3alpha"
          };

          assert.deepEqual(body, expected);
        });
      });
    });

    it('should remove a dis-tag called foo', function() {
      return server.request({
        method: 'DELETE',
        uri: '/-/package/testexp_tags2/dist-tags/foo',
      }).status(201).body_ok(/removed/).then(function() {
        return server.request({
          method: 'GET',
          uri: '/-/package/testexp_tags2/dist-tags',
        }).status(200).then(function(body) {
          const expected = {
            latest: '1.1.0',
            "quux": "0.1.0"
          };

          assert.deepEqual(body, expected);
        });
      });
    });

  });
};
