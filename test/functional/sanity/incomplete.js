import assert from 'assert';

const defaultPkg = {
  'name': 'testexp-incomplete',
  'versions': {
    '0.1.0': {
      'name': 'testexp_tags',
      'version': '0.1.0',
      'dist': {
        'shasum': 'fake',
        'tarball': 'http://localhost:55550/testexp-incomplete/-/content-length.tar.gz',
      },
    },
    '0.1.1': {
      'name': 'testexp_tags',
      'version': '0.1.1',
      'dist': {
        'shasum': 'fake',
        'tarball': 'http://localhost:55550/testexp-incomplete/-/chunked.tar.gz',
      },
    },
  },
};

export default function (server, express) {
  const ddd = ['content-length', 'chunked'];

  describe('test send incomplete packages', () => {

    beforeAll(function () {
      express.get('/testexp-incomplete', function (_, res) {
        res.send(defaultPkg);
      });
    });

    ddd.forEach(function (type) {
      test('should not store tarballs / ' + type, callback => {
        let called;
        express.get('/testexp-incomplete/-/' + type + '.tar.gz', function (_, response) {
          if (called) {
            return response.socket.destroy();
          }

          called = true;
          if (type !== 'chunked') {
            response.header('content-length', 1e6);
          }

          response.write('test test test\n');

          setTimeout(function () {
            response.socket.write('200\nsss\n');
            response.socket.destroy();
            cb();
          }, 10);
        });

        server.request({uri: '/testexp-incomplete/-/' + type + '.tar.gz'})
          .status(200)
          .response(function (res) {
            if (type !== 'chunked') {
              assert.equal(res.headers['content-length'], 1e6);
            }
          }).then(function (body) {
            assert(body.match(/test test test/));
          });

        function cb() {
          server.request({uri: '/testexp-incomplete/-/' + type + '.tar.gz'})
            .body_error('internal server error')
            .then(function () {
              callback();
            });
        }
      });
    });
  });
}
