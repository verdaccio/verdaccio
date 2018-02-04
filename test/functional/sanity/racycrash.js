export default function(server, express) {

  describe('test for unexpected client hangs', () => {
    let handleResponseTarball;

    beforeAll(function() {
      express.get('/testexp-racycrash', function(request, response) {
        response.send({
          'name': 'testexp-racycrash',
          'versions': {
            '0.1.0': {
              'name': 'testexp_tags',
              'version': '0.1.0',
              'dist': {
                'shasum': 'fake',
                'tarball': 'http://localhost:55550/testexp-racycrash/-/test.tar.gz',
              },
            },
          },
        });
      });

      express.get('/testexp-racycrash/-/test.tar.gz', function(request, response) {
        handleResponseTarball(response);
      });
    });

    test('should not crash on error if client disconnects', callback => {
      handleResponseTarball = function(res) {
        res.header('content-length', 1e6);
        res.write('test test test');
        setTimeout(function() {
          res.write('-');
          // destroy the connection
          res.socket.destroy();
          cb();
        }, 200);
      };

       server.request({uri: '/testexp-racycrash/-/test.tar.gz'})
         .then(function(body) {
           expect(body).toEqual('test test test');
         });

      function cb() {
        // test for NOT crashing
        server.request({uri: '/testexp-racycrash'})
          .status(200)
          .then(function() {
           callback();
          });
      }
    });

    test('should not store tarball', () => {
      handleResponseTarball = function(res) {
        res.socket.destroy();
      };

      return server.request({uri: '/testexp-racycrash/-/test.tar.gz'})
               .body_error('internal server error');
    });
  });
}
