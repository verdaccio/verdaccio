'use strict';

const assert = require('assert');

module.exports = function() {
  const server = process.server;
  const express = process.express;

  describe('test for unexpected client hangs', function() {
    let on_tarball;

    before(function() {
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
        on_tarball(response);
      });
    });

    it('should not crash on error if client disconnects', function(callback) {
      on_tarball = function(res) {
        res.header('content-length', 1e6);
        res.write('test test test\n');
        setTimeout(function() {
          res.write('test test test\n');
          res.socket.destroy();
          cb();
        }, 200);
      };

       server.request({uri: '/testexp-racycrash/-/test.tar.gz'})
         .then(function(body) {
           assert.equal(body, 'test test test\n');
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

    it('should not store tarball', function() {
      on_tarball = function(res) {
        res.socket.destroy();
      };

      return server.request({uri: '/testexp-racycrash/-/test.tar.gz'})
               .body_error('internal server error');
    });
  });
};

