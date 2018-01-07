import assert from 'assert';
import {generateSha} from '../lib/test.utils';

export default function(server, server2, express) {
  describe('should test preserve tags when publishing something', () => {

    beforeAll(function() {
      return server.request({
        uri: '/testpkg-preserve',
        headers: {
          'content-type': 'application/json',
        },
        method: 'PUT',
        json: require('./preserve_tags.json'),
      }).status(201);
    });

    test('add new package', () => {});

    describe('should check sha integrity', () => {

      const matchTarBallSha = (server) => {
        return server.getTarball('testpkg-preserve', 'testpkg-preserve-0.0.1.tgz')
          .status(200)
          .then(function(body) {
            // not real sha due to utf8 conversion
            assert.strictEqual(generateSha(body), '8ee7331cbc641581b1a8cecd9d38d744a8feb863');
          });
      };

      test('server1 should match with sha key from published package', () => {
        return matchTarBallSha(server);
      });

      test('server2 should match with sha key from published packagel', () => {
        matchTarBallSha(server2);
      });
    });

    describe('should match dist-tags', () => {
      const matchDisTags = (server, port) => {
        return server.getPackage('testpkg-preserve')
          .status(200)
          .then(function(body) {
            assert.equal(body.name, 'testpkg-preserve');
            assert.equal(body.versions['0.0.1'].name, 'testpkg-preserve');
            assert.equal(body.versions['0.0.1'].dist.tarball, `http://localhost:${port}/testpkg-preserve/-/testpkg-preserve-0.0.1.tgz`);
            assert.deepEqual(body['dist-tags'], {foo: '0.0.1', latest: '0.0.1'});
          });
      };

      test('server1 should be able to match latest dist-tags correctly', () => {
        return matchDisTags(server, '55551');
      });

      test('server2 should be able to match latest dist-tags correctly', () => {
        return matchDisTags(server2, '55552');
      });
    });

    describe('should test search', () => {
      const check = (obj) => {
        obj['testpkg-preserve'].time.modified = '2014-10-02T07:07:51.000Z';
        assert.deepEqual(obj['testpkg-preserve'],
          {
            'name': 'testpkg-preserve',
            'description': '',
            'author': '',
            'license': 'ISC',
            'dist-tags': {
              latest: '0.0.1'
            },
            'maintainers': [{
              name: 'alex',
              email: 'alex@kocharin.ru'
            }],
            'readmeFilename': '',
            'time': {
              modified: '2014-10-02T07:07:51.000Z'
            },
            'versions': {
              "0.0.1": "latest"
            },
            'repository': {
              type: 'git', url: ''}
          });
      };

      beforeAll(function() {
        express.get('/-/all', (req, res) => {
          res.send({});
        });
      });

      test('server1 - search', () => {
        return server.request({uri: '/-/all'})
                 .status(200)
                 .then(check);
      });

      test('server2 - search', () => {
        return server2.request({uri: '/-/all'})
                 .status(200)
                 .then(check);
      });

    });
  });
}
