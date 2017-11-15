'use strict';

require('../lib/startup');


module.exports = function () {
  const server2 = process.server2;

  describe('middlewares', function() {
    it('should serve the registered route', function() {
      return server2.request({
        uri: '/test/route',
        method: 'GET'
      })
      .status(200)
      .body_ok('this is a custom route')
    })
  })
}
