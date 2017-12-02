'use strict';

require('../lib/startup');


module.exports = function () {
  const server2 = process.server2;

  describe('middlewares', () => {
    test('should serve the registered route', () => {
      return server2.request({
        uri: '/test/route',
        method: 'GET'
      })
      .status(200)
      .body_ok('this is a custom route')
    })
  })
}
