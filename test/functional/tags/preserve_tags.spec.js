'use strict';

const assert = require('assert');
const utils = require ('../lib/test.utils');

module.exports = function() {
  let server = process.server;
  let server2 = process.server2;
  let express = process.express;

  describe('should test preserve tags when publishing something', () => {

    before(function() {
      return server.request({
        uri: '/testpkg-preserve',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
        json: require('./preserve_tags.json'),
      }).status(201);
    });

    it('add pkg', function() {});

    describe('should check sha integrity', () => {

      const matchTarBallSha = (server) => {
        return server.getTarball('testpkg-preserve', 'testpkg-preserve-0.0.0.tgz')
          .status(200)
          .then(function(body) {
            // not real sha due to utf8 conversion
            assert.strictEqual(utils.generateSha(body), '8ee7331cbc641581b1a8cecd9d38d744a8feb863');
          });
      };

      it('server1 should match with sha key from published package', () => {
        return matchTarBallSha(server);
      });

      it('server2 should match with sha key from published packagel', () => {
        matchTarBallSha(server2);
      });
    });

    describe('should match dist-tags', () => {
      const matchDisTags = (server, port) => {
        return server.getPackage('testpkg-preserve')
          .status(200)
          .then(function(body) {
            assert.equal(body.name, 'testpkg-preserve');
            assert.equal(body.versions['0.0.0'].name, 'testpkg-preserve');
            assert.equal(body.versions['0.0.0'].dist.tarball, `http://localhost:${port}/testpkg-preserve/-/testpkg-preserve-0.0.0.tgz`);
            assert.deepEqual(body['dist-tags'], {foo: '0.0.0', latest: '0.0.0'});
          });
      };

      it('server1 should be able to match latest dist-tags correctly', () => {
        return matchDisTags(server, '55551');
      });

      it('server2 should be able to match latest dist-tags correctly', function() {
        return matchDisTags(server2, '55552');
      });
    });

    describe('should test search', function() {
      const check = (obj) => {
        obj['testpkg-preserve'].time.modified = '2014-10-02T07:07:51.000Z';
        assert.deepEqual(obj['testpkg-preserve'],
          {
            'name': 'testpkg-preserve',
            'description': '',
            'author': '',
            'license': 'ISC',
            'dist-tags': {
              latest: '0.0.0'
            },
            'maintainers': [{
              name: 'alex',
              email: 'alex@kocharin.ru'
            }],
            'readmeFilename': '',
            'time': {
              modified: '2014-10-02T07:07:51.000Z'
            },
            'versions': {},
            'repository': {
              type: 'git', url: ''}
          });
      };

      before(function() {
        express.get('/-/all', (req, res) => {
          res.send({});
        });
      });

      it('server1 - search', () => {
        return server.request({uri: '/-/all'})
                 .status(200)
                 .then(check);
      });

      it('server2 - search', () => {
        return server2.request({uri: '/-/all'})
                 .status(200)
                 .then(check);
      });

    });
  });
};
