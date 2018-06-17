import assert from 'assert';
import zlib from 'zlib';
import {readFile} from '../lib/test.utils';

export default function(server, express) {

  describe('test gzip support', () => {
    beforeAll(function() {
      express.get('/testexp_gzip', function(req, res) {
        const pkg = eval(
          '(' + readFile('../fixtures/publish.json5')
            .toString('utf8')
            .replace(/__NAME__/g, 'testexp_gzip')
            .replace(/__VERSION__/g, '0.0.1')
          + ')'
        );

        // overcoming compress threshold
        pkg.versions['0.0.2'] = pkg.versions['0.0.1'];
        pkg.versions['0.0.3'] = pkg.versions['0.0.1'];
        pkg.versions['0.0.4'] = pkg.versions['0.0.1'];
        pkg.versions['0.0.5'] = pkg.versions['0.0.1'];
        pkg.versions['0.0.6'] = pkg.versions['0.0.1'];
        pkg.versions['0.0.7'] = pkg.versions['0.0.1'];
        pkg.versions['0.0.8'] = pkg.versions['0.0.1'];
        pkg.versions['0.0.9'] = pkg.versions['0.0.1'];

        zlib.gzip(JSON.stringify(pkg), function(err, buf) {
          assert.equal(err, null);
          assert.equal(req.headers['accept-encoding'], 'gzip');
          res.header('content-encoding', 'gzip');
          res.send(buf);
        });
      });

      express.get('/testexp_baddata', function(req, res) {
        assert.equal(req.headers['accept-encoding'], 'gzip');
        res.header('content-encoding', 'gzip');
        res.send(new Buffer([1, 2, 3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 2, 1]));
      });
    });

    test('should not fail on bad gzip', () => {
      return server.getPackage('testexp_baddata').status(404);
    });

    test('should understand gzipped data from uplink', () => {
      return server.getPackage('testexp_gzip')
               .status(200)
               .response(function(res) {
                 assert.equal(res.headers['content-encoding'], undefined);
               })
               .then(function(body) {
                 assert.equal(body.name, 'testexp_gzip');
                 assert.equal(Object.keys(body.versions).length, 9);
               });
    });

    test('should serve gzipped data', () => {
      return server.request({
        uri: '/testexp_gzip',
        encoding: null,
        headers: {
          'Accept-encoding': 'gzip',
        },
        json: false,
      }).status(200)
        .response(function(res) {
          assert.equal(res.headers['content-encoding'], 'gzip');
        })
        .then(function(body) {
          assert.throws(function() {
            JSON.parse(body.toString('utf8'));
          });

          return new Promise(function(resolve) {
            zlib.gunzip(body, function(err, buf) {
              assert.equal(err, null);
              body = JSON.parse(buf);
              assert.equal(body.name, 'testexp_gzip');
              assert.equal(Object.keys(body.versions).length, 9);
              resolve();
            });
          });
        });
    });
  });
}
