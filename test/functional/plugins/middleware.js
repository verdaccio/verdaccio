import {HTTP_STATUS} from "../../../src/lib/constants";

export default function (server2) {
  describe('test plugin middlewares', () => {
    test('should serve the registered route ES5', () => {
      return server2.request({
        uri: '/test/route',
        method: 'GET'
      })
      .status(HTTP_STATUS.OK)
      .body_ok('this is a custom route')
    })

    test('should serve the registered route ES6', () => {
      return server2.request({
        uri: '/test/route/es6',
        method: 'GET'
      })
        .status(HTTP_STATUS.OK)
        .body_ok('this is a custom route es6')
    })
  })
}
